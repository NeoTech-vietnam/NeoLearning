// Section 20
// Standard Template Library - Vector
#include <iostream>
#include <vector>
#include <algorithm>

class Person {
    friend std::ostream &operator<<(std::ostream &os, const Person &p);
    std::string name;
    int age;
public:
    Person() = default;
    Person(std::string name, int age)
      : name{name}, age{age} {}
    bool operator<(const Person &rhs) const {
        return (this->name == rhs.name && this->age == rhs.age);
    }
};

std::ostream &operator<<(std::ostream &os, const Person &p){
    os << p.name << ":" << p.age;
    return os;
}

// Use for_each and a lambda expression to display vector elements
void display2(const std::vector<int> &vec){
    std::cout << "[ ";
    std::for_each(vec.begin(),vec.end(), [](int x){std::cout << x << " ";});
    std::cout << "]" << std::endl;
}

template <typename T>
void display(const std::vector<T> &vec){
    std::cout << "[ ";
    for(const auto &elem: vec)
        std::cout << elem << " ";
    std::cout << "]" << std::endl;
}

void test1(){
    std::cout << "\nTest1 ===================================" << std::endl;
    std::vector<int> vec{1,2,3,4,5};
    display(vec);

    vec = {2,4,5,6};
    display2(vec);

    std::vector<int> vec1(10,100); //ten 100s in the vector
    display(vec1);
}

void test2(){
    std::cout << "\nTest2 ===================================" << std::endl;
    std::vector<int> vec{1,2,3,4,5};
    display(vec);
    std::cout << "\nVec size: " << vec.size() << std::endl;
    std::cout << "\nVec max size: " << vec.max_size() << std::endl;
    std::cout << "\nVec capacity: " << vec.capacity() << std::endl;
    
    vec.push_back(6);
    display(vec);
    std::cout << "\nVec size: " << vec.size() << std::endl;
    std::cout << "\nVec max size: " << vec.max_size() << std::endl;
    std::cout << "\nVec capacity: " << vec.capacity() << std::endl;
    
    vec.shrink_to_fit(); // C++ 11
    display(vec);
    std::cout << "\nVec size: " << vec.size() << std::endl;
    std::cout << "\nVec max size: " << vec.max_size() << std::endl;
    std::cout << "\nVec capacity: " << vec.capacity() << std::endl;
    
    vec.reserve(100);
    display(vec);
    std::cout << "\nVec size: " << vec.size() << std::endl;
    std::cout << "\nVec max size: " << vec.max_size() << std::endl;
    std::cout << "\nVec capacity: " << vec.capacity() << std::endl;
    
}

int main(void){
    // test1();
    test2();
    return 0;
}