// Section 17
// Weak pointer

#include <iostream>
#include <memory>

using namespace std;

class B; // Forward declaration

class A {
    std::shared_ptr<B> b_ptr;
public:
    void set_B(std::shared_ptr<B> &b) {
        b_ptr = b;
    }
    A() {cout << "A constructor " << endl; }
    ~A() {cout << "A destructor " << endl; }
};

class B {
    std::weak_ptr<A> a_ptr; // make weak to break the strong circular reference
public:
    void set_A(std::shared_ptr<A> &a) {
        a_ptr = a;
    }
    B() {cout << "B constructor " << endl; }
    ~B() {cout << "B destructor " << endl; }
};

int main (void){
    shared_ptr<A> a = make_shared<A>();
    shared_ptr<B> b = make_shared<B>();

    a->set_B(b);
    b->set_A(a);

    return 0;
}