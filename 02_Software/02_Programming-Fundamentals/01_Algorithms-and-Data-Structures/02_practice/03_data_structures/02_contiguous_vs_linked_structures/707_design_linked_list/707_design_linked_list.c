/* 707 Design Linked List: sentinel + size + tail, C11.
 * Negative insertion indices insert at head (local defensive contract).
 * Compile this file normally for the embedded harness; LOCAL_TEST also enables
 * deterministic allocation-failure and allocation/release accounting checks.
 */
#include <limits.h>
#include <stdint.h>
#include <stdio.h>
#include <stdlib.h>

typedef struct Node {
    int val;
    struct Node *next;
} Node;

typedef struct {
    Node sentinel;
    Node *tail;
    size_t size;
} MyLinkedList;

#ifdef LOCAL_TEST
static int fail_next_allocation = 0;
static size_t allocations = 0, releases = 0;
#endif

static void *listAllocate(size_t bytes)
{
#ifdef LOCAL_TEST
    if (fail_next_allocation) {
        fail_next_allocation = 0;
        return NULL;
    }
#endif
    void *result = malloc(bytes);
#ifdef LOCAL_TEST
    if (result != NULL) ++allocations;
#endif
    return result;
}

static void listRelease(void *allocation)
{
#ifdef LOCAL_TEST
    if (allocation != NULL) ++releases;
#endif
    free(allocation);
}

MyLinkedList *myLinkedListCreate(void)
{
    MyLinkedList *list = listAllocate(sizeof *list);
    if (list == NULL) return NULL;
    list->sentinel.val = 0; /* Not a user value. */
    list->sentinel.next = NULL;
    list->tail = &list->sentinel;
    list->size = 0;
    return list;
}

int myLinkedListGet(MyLinkedList *list, int index)
{
    if (list == NULL || index < 0 || (size_t)index >= list->size) return -1;
    const Node *node = list->sentinel.next;
    for (int i = 0; i < index; ++i) node = node->next;
    return node->val;
}

/* Allocate first: failure cannot change links, size or tail. */
static void insertAfter(MyLinkedList *list, Node *previous, int value)
{
    if (list->size == SIZE_MAX) return;
    Node *node = listAllocate(sizeof *node);
    if (node == NULL) return;
    node->val = value;
    node->next = previous->next;
    previous->next = node;
    if (list->tail == previous) list->tail = node;
    ++list->size;
}

void myLinkedListAddAtHead(MyLinkedList *list, int val)
{
    if (list != NULL) insertAfter(list, &list->sentinel, val);
}

void myLinkedListAddAtTail(MyLinkedList *list, int val)
{
    if (list != NULL) insertAfter(list, list->tail, val);
}

void myLinkedListAddAtIndex(MyLinkedList *list, int index, int val)
{
    if (list == NULL) return;
    if (index <= 0) { myLinkedListAddAtHead(list, val); return; }
    if ((size_t)index > list->size) return;
    if ((size_t)index == list->size) { myLinkedListAddAtTail(list, val); return; }
    Node *previous = &list->sentinel;
    for (int i = 0; i < index; ++i) previous = previous->next;
    insertAfter(list, previous, val);
}

void myLinkedListDeleteAtIndex(MyLinkedList *list, int index)
{
    if (list == NULL || index < 0 || (size_t)index >= list->size) return;
    Node *previous = &list->sentinel;
    for (int i = 0; i < index; ++i) previous = previous->next;
    Node *removed = previous->next;
    previous->next = removed->next;
    if (list->tail == removed) list->tail = previous;
    --list->size;
    listRelease(removed);
}

void myLinkedListFree(MyLinkedList *list)
{
    if (list == NULL) return;
    Node *node = list->sentinel.next;
    while (node != NULL) {
        Node *next = node->next;
        listRelease(node);
        node = next;
    }
    listRelease(list); /* The embedded sentinel is never separately freed. */
}

/* Embedded harness: an array is the oracle, never the list implementation. */
enum { CAPACITY = 4096 };
typedef struct { int values[CAPACITY]; size_t size; } Model;
static size_t state_checks = 0;
static int passed = 0, total = 0;

static int matches(const MyLinkedList *list, const Model *model)
{
    ++state_checks;
    if (list == NULL || list->size != model->size) return 0;
    const Node *node = list->sentinel.next, *last = &list->sentinel;
    /* Bounded by the independent model: cycles/extra nodes fail at the end. */
    for (size_t i = 0; i < model->size; ++i) {
        if (node == NULL || node->val != model->values[i]) return 0;
        last = node;
        node = node->next;
    }
    return node == NULL && list->tail == last && list->tail->next == NULL;
}

/* op: 0=head, 1=tail, 2=index insertion, 3=delete, 4=get. */
static int apply(MyLinkedList *list, Model *model, int op, int index, int value)
{
    const size_t old_size = model->size;
    if (op == 0) { myLinkedListAddAtHead(list, value); index = 0; }
    else if (op == 1) { myLinkedListAddAtTail(list, value); index = (int)old_size; }
    else if (op == 2) {
        myLinkedListAddAtIndex(list, index, value);
        if (index < 0) index = 0;
    } else if (op == 3) {
        myLinkedListDeleteAtIndex(list, index);
        if (index >= 0 && (size_t)index < old_size) {
            for (size_t j = (size_t)index; j + 1 < old_size; ++j)
                model->values[j] = model->values[j + 1];
            --model->size;
        }
    } else {
        int expected = index >= 0 && (size_t)index < old_size ? model->values[index] : -1;
        if (myLinkedListGet(list, index) != expected) return 0;
    }
    if (op <= 2 && index >= 0 && (size_t)index <= old_size) {
        if (old_size == CAPACITY) return 0;
        for (size_t j = old_size; j > (size_t)index; --j)
            model->values[j] = model->values[j - 1];
        model->values[index] = value;
        ++model->size;
    }
    return matches(list, model);
}

static void result(const char *input, int ok)
{
    ++total;
    passed += ok != 0;
    printf("%02d. Input: %s\n    Actual: %s | %s\n", total, input,
           ok ? "all values, size, tail and termination match" : "contract mismatch",
           ok ? "PASS" : "FAIL");
    if (!ok) puts("    Expected: the array oracle and every structural invariant agree");
}

static void boundaryCases(void)
{
    MyLinkedList *list = myLinkedListCreate();
    Model model = {{0}, 0};
    if (list == NULL) { result("create list", 0); return; }
    int ok = matches(list, &model);
    ok &= apply(list, &model, 4, 0, 0);
    ok &= apply(list, &model, 4, -1, 0);
    ok &= apply(list, &model, 3, 0, 0);
    ok &= apply(list, &model, 3, INT_MIN, 0);
    result("empty get/delete; negative get/delete", ok);

    ok = apply(list, &model, 2, -7, INT_MIN);
    ok &= apply(list, &model, 4, 0, 0);
    ok &= apply(list, &model, 3, 0, 0);
    ok &= apply(list, &model, 1, 0, INT_MAX);
    ok &= apply(list, &model, 3, 0, 0);
    ok &= apply(list, &model, 0, 0, -1);
    result("negative insertion, singleton deletion, append/head after clear", ok);

    ok = apply(list, &model, 1, 0, 3);
    ok &= apply(list, &model, 2, 1, 2);
    ok &= apply(list, &model, 0, 0, 1);
    ok &= apply(list, &model, 2, (int)model.size, 4);
    ok &= apply(list, &model, 4, 2, 0);
    ok &= apply(list, &model, 3, 2, 0);
    ok &= apply(list, &model, 3, (int)model.size - 1, 0);
    ok &= apply(list, &model, 3, 0, 0);
    result("head/tail/middle insertion and deletion; insert at size", ok);

    ok = apply(list, &model, 2, INT_MAX, 9);
    ok &= apply(list, &model, 3, (int)model.size, 0);
    ok &= apply(list, &model, 3, INT_MAX, 0);
    ok &= apply(list, &model, 4, (int)model.size, 0);
    ok &= apply(list, &model, 4, INT_MAX, 0);
    ok &= apply(list, &model, 2, INT_MIN, 7);
    ok &= apply(list, &model, 1, 0, 7);
    ok &= apply(list, &model, 0, 0, INT_MIN);
    ok &= apply(list, &model, 1, 0, INT_MAX);
    result("equal-size/oversized bounds, INT_MIN index, duplicates and boundary values", ok);

    ok = 1;
    while (model.size != 0) ok &= apply(list, &model, 3, (int)model.size - 1, 0);
    ok &= apply(list, &model, 1, 0, 99);
    MyLinkedList *other = myLinkedListCreate();
    Model other_model = {{0}, 0};
    if (other == NULL) ok = 0;
    else {
        ok &= apply(other, &other_model, 0, 0, 42);
        ok &= apply(list, &model, 0, 0, 88);
        ok &= matches(other, &other_model);
        myLinkedListFree(other);
    }
    result("clear and reuse, independent instances", ok);
    myLinkedListFree(list);

    myLinkedListAddAtHead(NULL, 1);
    myLinkedListAddAtTail(NULL, 1);
    myLinkedListAddAtIndex(NULL, -1, 1);
    myLinkedListDeleteAtIndex(NULL, 0);
    myLinkedListFree(NULL);
    result("defensive null-object API", myLinkedListGet(NULL, 0) == -1);
}

static void deterministicOracle(void)
{
    MyLinkedList *list = myLinkedListCreate();
    Model model = {{0}, 0};
    if (list == NULL) { result("2000 deterministic operations", 0); return; }
    uint32_t seed = UINT32_C(0x707c2026);
    int ok = 1;
    for (int step = 0; step < 2000; ++step) {
        seed = seed * UINT32_C(1664525) + UINT32_C(1013904223);
        int op = (int)((seed >> 16) % 5);
        seed = seed * UINT32_C(1664525) + UINT32_C(1013904223);
        int index = (int)(seed % (uint32_t)(model.size + 6)) - 3;
        int value = (int)(seed % 2001) - 1000;
        if (!apply(list, &model, op, index, value)) {
            fprintf(stderr, "Oracle mismatch at step %d (op=%d index=%d value=%d)\n",
                    step, op, index, value);
            ok = 0;
            break;
        }
    }
    result("2000 deterministic array-oracle operations; complete state after each", ok);
    myLinkedListFree(list);
}

#ifdef LOCAL_TEST
static void allocationFailures(void)
{
    fail_next_allocation = 1;
    MyLinkedList *failed = myLinkedListCreate();
    int ok = failed == NULL;
    myLinkedListFree(failed);
    MyLinkedList *list = myLinkedListCreate();
    Model model = {{0}, 0};
    if (list == NULL) { result("deterministic allocation failures", 0); return; }
    ok &= apply(list, &model, 1, 0, 10);
    ok &= apply(list, &model, 1, 0, 30);
    const size_t before = allocations;
    fail_next_allocation = 1; myLinkedListAddAtHead(list, 1);
    ok &= matches(list, &model) && allocations == before;
    fail_next_allocation = 1; myLinkedListAddAtTail(list, 40);
    ok &= matches(list, &model) && allocations == before;
    fail_next_allocation = 1; myLinkedListAddAtIndex(list, 1, 20);
    ok &= matches(list, &model) && allocations == before;
    myLinkedListFree(list);
    result("failed create/head/tail/interior allocation preserves original state", ok);
    result("successful allocation/release counts balance after all cleanup", allocations == releases);
    printf("    Allocation accounting: %zu successful allocations, %zu releases\n", allocations, releases);
}
#endif

int main(void)
{
    boundaryCases();
    deterministicOracle();
#ifdef LOCAL_TEST
    allocationFailures();
#endif
    printf("\n%d/%d tests passed; %zu complete state checks\n", passed, total, state_checks);
    return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}
