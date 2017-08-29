function Person(name,age){
    this.name=name;
    this.age=age;
}
Person.prototype.walk=function(speed){
    console.log(this.name+'가'+speed+'km속도로 걸어갑니다.');

}
var person3=new Person('kong',20);
var person4=new Person('kim',22);
person3.walk(10);
