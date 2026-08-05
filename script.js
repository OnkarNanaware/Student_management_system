let students = JSON.parse(localStorage.getItem("students")) || [];
let editIndex = -1;

displayStudents();

function addStudent(){

    let name = document.getElementById("name").value.trim();
    let age = document.getElementById("age").value;
    let course = document.getElementById("course").value.trim();

    if(name=="" || age=="" || course==""){
        alert("Please fill all fields");
        return;
    }

    if(editIndex==-1){

        students.push({
            id: Date.now(),
            name,
            age,
            course
        });

    }else{

        students[editIndex].name=name;
        students[editIndex].age=age;
        students[editIndex].course=course;

        editIndex=-1;
    }

    saveData();
    clearForm();
    displayStudents();
}

function displayStudents(list=students){

    let table=document.getElementById("studentTable");

    table.innerHTML="";

    list.forEach((student,index)=>{

        table.innerHTML+=`
        <tr>
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.age}</td>
            <td>${student.course}</td>
            <td>
                <button class="edit" onclick="editStudent(${index})">Edit</button>

                <button class="delete" onclick="deleteStudent(${index})">Delete</button>
            </td>
        </tr>
        `;
    });

}

function editStudent(index){

    document.getElementById("name").value=students[index].name;
    document.getElementById("age").value=students[index].age;
    document.getElementById("course").value=students[index].course;

    editIndex=index;
}

function deleteStudent(index){

    if(confirm("Delete this student?")){
        students.splice(index,1);
        saveData();
        displayStudents();
    }

}

function searchStudent(){

    let value=document.getElementById("search").value.toLowerCase();

    let filtered=students.filter(student=>
        student.name.toLowerCase().includes(value) ||
        student.course.toLowerCase().includes(value)
    );

    displayStudents(filtered);

}

function clearForm(){

    document.getElementById("name").value="";
    document.getElementById("age").value="";
    document.getElementById("course").value="";

}

function saveData(){

    localStorage.setItem("students",JSON.stringify(students));

}
