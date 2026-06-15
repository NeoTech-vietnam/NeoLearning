// Create a generic array template class

// Note: Since C++ 11 the STL has std::arry which is a template-based array class
// Use std::array instead of raw arrays whenever possible

// Note that we can have non-type template parameters
// That's what N is in this case

#include <iostream>
#include <string>

template <typename T, int N>
class Array {
    int size {N}; // How do we get the N???
    T values[N]; // the N needs knowing at compile-time
    friend std::ostream &operator<<(std::ostream &os, const Array<T, N> &arr){
        os << "[ ";
        for(const auto &val: arr.values)
            os << val << " ";
        os << "]" << std::endl;
        return os;
    }
public:
    Array() = default;
    Array(T init_val){
        for(auto &item: values)
            item = init_val;
    }

    void fill(T val){
        for(auto &item: values)
            item = val;
    }
    int get_size() const {
        return size;
    }
    //Overload subscript operator for easy use
    T &operator[](int index) {
        return values[index];
    }
};

int main(void){

    Array<int, 5> nums;
    std::cout << "The size of nums is: " << nums.get_size() << std::endl;
    std::cout << nums << std::endl;

    nums.fill(0);
    std::cout << "The size of nums is: " << nums.get_size() << std::endl;
    std::cout << nums << std::endl;

    nums.fill(10);
    std::cout << nums << std::endl;

    nums[0] = 1000;
    nums[3] = 2000;
    std::cout << nums << std::endl;

    Array<int, 100> nums2 {1};
    std::cout << "The size of nums2 is: " << nums2.get_size() << std::endl;
    std::cout << nums2 << std::endl;

    Array<std::string, 10> strings(std::string{"Frank"});
    std::cout << "The size of string is: " << strings.get_size() << std::endl;
    std::cout << strings << std::endl;

    strings[0] = std::string{"Larry"};
    std::cout << strings << std::endl;

    strings.fill(std::string{"X"});
    std::cout << strings << std::endl;

    return 0;
}