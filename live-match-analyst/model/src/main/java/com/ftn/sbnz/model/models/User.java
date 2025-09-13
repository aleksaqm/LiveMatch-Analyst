package com.ftn.sbnz.model.models;

public class User {
    private String name;
    private int age;
    private String status; // "old" or "young"

    public User() {}

    public User(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // getters and setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getAge() { return age; }
    public void setAge(int age) { this.age = age; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    @Override
    public String toString() {
        return "User{name='" + name + "', age=" + age + ", status='" + status + "'}";
    }
}
