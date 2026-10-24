// 707 Design Linked List: sentinel + size + tail, C++17.
// Define LOCAL_TEST to include the embedded harness and test-only inspection.
#include <cstddef>
#include <limits>
#include <stdexcept>
#ifdef LOCAL_TEST
#include <climits>
#include <cstdint>
#include <cstdlib>
#include <iostream>
#include <string>
#include <type_traits>
#include <vector>
#endif

class MyLinkedList {
    struct Node {
        int val;
        Node *next;
    };
    Node sentinel_{0, nullptr};
    Node *tail_ = &sentinel_;
    std::size_t size_ = 0;

#ifdef LOCAL_TEST
    inline static std::size_t allocations_ = 0, releases_ = 0;
#endif

    void insertAfter(Node *previous, int value)
    {
        if (size_ == std::numeric_limits<std::size_t>::max())
            throw std::length_error("linked-list size overflow");
        // new may throw before any mutation; original state stays intact.
        Node *node = new Node{value, previous->next};
#ifdef LOCAL_TEST
        ++allocations_;
#endif
        previous->next = node;
        if (tail_ == previous) tail_ = node;
        ++size_;
    }

    static void release(Node *node) noexcept
    {
#ifdef LOCAL_TEST
        ++releases_;
#endif
        delete node;
    }

public:
    MyLinkedList() = default;
    MyLinkedList(const MyLinkedList &) = delete;
    MyLinkedList &operator=(const MyLinkedList &) = delete;
    MyLinkedList(MyLinkedList &&) = delete;
    MyLinkedList &operator=(MyLinkedList &&) = delete;

    ~MyLinkedList()
    {
        Node *node = sentinel_.next;
        while (node != nullptr) {
            Node *next = node->next;
            release(node);
            node = next;
        }
    }

    int get(int index) const
    {
        if (index < 0 || static_cast<std::size_t>(index) >= size_) return -1;
        const Node *node = sentinel_.next;
        for (int i = 0; i < index; ++i) node = node->next;
        return node->val;
    }

    void addAtHead(int val) { insertAfter(&sentinel_, val); }
    void addAtTail(int val) { insertAfter(tail_, val); }

    void addAtIndex(int index, int val)
    {
        if (index <= 0) { addAtHead(val); return; }
        if (static_cast<std::size_t>(index) > size_) return;
        if (static_cast<std::size_t>(index) == size_) { addAtTail(val); return; }
        Node *previous = &sentinel_;
        for (int i = 0; i < index; ++i) previous = previous->next;
        insertAfter(previous, val);
    }

    void deleteAtIndex(int index)
    {
        if (index < 0 || static_cast<std::size_t>(index) >= size_) return;
        Node *previous = &sentinel_;
        for (int i = 0; i < index; ++i) previous = previous->next;
        Node *removed = previous->next;
        previous->next = removed->next;
        if (tail_ == removed) tail_ = previous;
        --size_;
        release(removed);
    }

#ifdef LOCAL_TEST
    // Test-only; no traversal is added to production endpoint operations.
    bool testMatches(const std::vector<int> &expected) const
    {
        if (size_ != expected.size()) return false;
        const Node *node = sentinel_.next, *last = &sentinel_;
        for (int value : expected) {
            if (node == nullptr || node->val != value) return false;
            last = node;
            node = node->next;
        }
        return node == nullptr && tail_ == last && tail_->next == nullptr;
    }
    static std::size_t testAllocations() { return allocations_; }
    static std::size_t testReleases() { return releases_; }
#endif
};

#ifdef LOCAL_TEST
static_assert(!std::is_copy_constructible<MyLinkedList>::value, "unique ownership");
static_assert(!std::is_copy_assignable<MyLinkedList>::value, "unique ownership");
static_assert(!std::is_move_constructible<MyLinkedList>::value, "sentinel self-reference");
static_assert(!std::is_move_assignable<MyLinkedList>::value, "sentinel self-reference");

static int passed = 0, total = 0;
static std::size_t stateChecks = 0;

static bool matches(const MyLinkedList &list, const std::vector<int> &model)
{
    ++stateChecks;
    return list.testMatches(model);
}

// The vector is an independent oracle, never the linked-list implementation.
static bool apply(MyLinkedList &list, std::vector<int> &model,
                  int op, int index, int value)
{
    const int oldSize = static_cast<int>(model.size());
    if (op == 0) { list.addAtHead(value); model.insert(model.begin(), value); }
    else if (op == 1) { list.addAtTail(value); model.push_back(value); }
    else if (op == 2) {
        list.addAtIndex(index, value);
        if (index < 0) index = 0;
        if (index <= oldSize) model.insert(model.begin() + index, value);
    } else if (op == 3) {
        list.deleteAtIndex(index);
        if (index >= 0 && index < oldSize) model.erase(model.begin() + index);
    } else {
        const int expected = index >= 0 && index < oldSize ? model[static_cast<std::size_t>(index)] : -1;
        if (list.get(index) != expected) return false;
    }
    return matches(list, model);
}

static void result(const std::string &input, bool ok)
{
    ++total;
    passed += ok;
    std::cout << (total < 10 ? "0" : "") << total << ". Input: " << input
              << "\n    Actual: " << (ok ? "all values, size, tail and termination match" : "contract mismatch")
              << " | " << (ok ? "PASS" : "FAIL") << '\n';
    if (!ok) std::cout << "    Expected: the vector oracle and every structural invariant agree\n";
}

static void boundaryCases()
{
    MyLinkedList list;
    std::vector<int> model;
    bool ok = matches(list, model);
    ok &= apply(list, model, 4, 0, 0);
    ok &= apply(list, model, 4, -1, 0);
    ok &= apply(list, model, 3, 0, 0);
    ok &= apply(list, model, 3, INT_MIN, 0);
    result("empty get/delete; negative get/delete", ok);

    ok = apply(list, model, 2, -7, INT_MIN);
    ok &= apply(list, model, 4, 0, 0);
    ok &= apply(list, model, 3, 0, 0);
    ok &= apply(list, model, 1, 0, INT_MAX);
    ok &= apply(list, model, 3, 0, 0);
    ok &= apply(list, model, 0, 0, -1);
    result("negative insertion, singleton deletion, append/head after clear", ok);

    ok = apply(list, model, 1, 0, 3);
    ok &= apply(list, model, 2, 1, 2);
    ok &= apply(list, model, 0, 0, 1);
    ok &= apply(list, model, 2, static_cast<int>(model.size()), 4);
    ok &= apply(list, model, 4, 2, 0);
    ok &= apply(list, model, 3, 2, 0);
    ok &= apply(list, model, 3, static_cast<int>(model.size()) - 1, 0);
    ok &= apply(list, model, 3, 0, 0);
    result("head/tail/middle insertion and deletion; insert at size", ok);

    ok = apply(list, model, 2, INT_MAX, 9);
    ok &= apply(list, model, 3, static_cast<int>(model.size()), 0);
    ok &= apply(list, model, 3, INT_MAX, 0);
    ok &= apply(list, model, 4, static_cast<int>(model.size()), 0);
    ok &= apply(list, model, 4, INT_MAX, 0);
    ok &= apply(list, model, 2, INT_MIN, 7);
    ok &= apply(list, model, 1, 0, 7);
    ok &= apply(list, model, 0, 0, INT_MIN);
    ok &= apply(list, model, 1, 0, INT_MAX);
    result("equal-size/oversized bounds, INT_MIN index, duplicates and boundary values", ok);

    ok = true;
    while (!model.empty()) ok &= apply(list, model, 3, static_cast<int>(model.size()) - 1, 0);
    ok &= apply(list, model, 1, 0, 99);
    MyLinkedList other;
    std::vector<int> otherModel;
    ok &= apply(other, otherModel, 0, 0, 42);
    ok &= apply(list, model, 0, 0, 88);
    ok &= matches(other, otherModel);
    result("clear and reuse, independent instances", ok);
}

static void deterministicOracle()
{
    MyLinkedList list;
    std::vector<int> model;
    std::uint32_t seed = UINT32_C(0x707c2026);
    bool ok = true;
    for (int step = 0; step < 2000; ++step) {
        seed = seed * UINT32_C(1664525) + UINT32_C(1013904223);
        int op = static_cast<int>((seed >> 16) % 5);
        seed = seed * UINT32_C(1664525) + UINT32_C(1013904223);
        int index = static_cast<int>(seed % static_cast<std::uint32_t>(model.size() + 6)) - 3;
        int value = static_cast<int>(seed % 2001) - 1000;
        if (!apply(list, model, op, index, value)) {
            std::cerr << "Oracle mismatch at step " << step << " (op=" << op
                      << " index=" << index << " value=" << value << ")\n";
            ok = false;
            break;
        }
    }
    result("2000 deterministic vector-oracle operations; complete state after each", ok);
}

int main()
{
    boundaryCases();
    deterministicOracle();
    // Both function scopes have ended; their destructors have released all nodes.
    result("successful new/delete counts balance after all destructors",
           MyLinkedList::testAllocations() == MyLinkedList::testReleases());
    std::cout << "    Allocation accounting: " << MyLinkedList::testAllocations()
              << " successful allocations, " << MyLinkedList::testReleases() << " releases\n";
    std::cout << '\n' << passed << '/' << total << " tests passed; " << stateChecks
              << " complete state checks\n";
    return passed == total ? EXIT_SUCCESS : EXIT_FAILURE;
}
#endif
