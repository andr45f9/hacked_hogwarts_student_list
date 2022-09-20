"use strict";

window.addEventListener("DOMContentLoaded", start);

//url with JSON data
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

//array where the new object should get stored in
const allStudents = [];

//This variable will later on hold the json files.
let list;

//Object with new "cleaned" data.
const Student = {
  firstName: "",
  lastName: "",
  middleName: "undefined",
  nickName: "",
  image: "",
  house: "",
  gender: "",
  star: false,
  trophy: false,
};

function start() {
  console.log("ready");

  loadJSON();
}

async function loadJSON() {
  const response = await fetch(url);
  const json = await response.json();

  list = json;

  // when loaded, prepare objects
  prepareStudents(list);
}

function prepareStudents(list) {
  list.forEach((studentObject) => {
    const student = Object.create(Student); //Create object with cleaned data - store it in the allStudents array.

    //Making sure there is no extra space around any name, house nor gender.
    let fullName = studentObject.fullname.trim();
    let house = studentObject.house.trim();
    let gender = studentObject.gender.trim();

    //Getting the FIRST NAME nad making it upper case.
    student.firstName = fullName.substring(0, 1).toUpperCase() + fullName.substring(1, fullName.indexOf(" ")).toLowerCase();

    //If a student only has a first name, and therefore does not include any space after the name. Then that should be the students "fullname"
    if (fullName.includes(" ") === false) {
      student.firstName = fullName.substring(0, 1).toUpperCase() + fullName.substring(1).toLowerCase();
    }
    //console.log(student.firstName);

    //Getting the MIDDLE NAME and NICK NAME, and making it upper case.
    student.middelName = fullName.substring(fullName.indexOf(" "), fullName.lastIndexOf(" ")).trim().substring(0, 1).toUpperCase() + fullName.substring(fullName.indexOf(" "), fullName.lastIndexOf(" ")).trim().substring(1).toLowerCase();
    //One student has a nick name instead of af middle name, this will define that if full name includes ""
    if (fullName.includes(`"`)) {
      student.nickName = fullName.substring(fullName.indexOf(`"`) + 1, fullName.indexOf(`"`) + 2).toUpperCase() + fullName.substring(fullName.indexOf(`"`) + 2, fullName.lastIndexOf(`"`)).toLowerCase();
      //This will remove "Ernie" from the middle name list and put the nickname on the actual nicname list.
      student.middelName = "";
    }

    //Getting the LAST NAME and making it upper case.
    student.lastName = fullName.substring(fullName.lastIndexOf(" ") + 1, fullName.lastIndexOf(" ") + 2).toUpperCase() + fullName.substring(fullName.lastIndexOf(" ") + 2).toLowerCase();
    //last name with a hyphen included --- have to do ---

    //Getting the GENDER and making it upper case.
    student.gender = gender.substring(0, 1).toUpperCase() + gender.substring(1).toLowerCase();

    //Getting the HOUSE NAME and making it upper case.
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();

    //Getting the IMAGE URL by the lastname in lowercase + _ + the first letter of the first name and the .png.
    student.image = fullName.substring(fullName.lastIndexOf(" ")).trim().toLowerCase() + "_" + fullName.substring(0, 1).toLowerCase() + ".png";

    //storing our new object in the allStudents array.
    allStudents.push(student);
  });

  //Displaying the students array as a table in the console.
  console.table(allStudents);

  displayList(allStudents);
}

function displayList(allStudents) {
  const container = document.querySelector(".list_container");
  container.textContent = "";

  allStudents.forEach((student) => {
    const template = document.querySelector("#student_list");
    let clone = template.cloneNode(true).content;

    clone.querySelector("[data-field=fullname]").textContent = student.firstName + " " + student.lastName;

    // set clone data for STAR
    if (student.star === true) {
      clone.querySelector("[data-field=star]").textContent = "⭐";
    } else {
      clone.querySelector("[data-field=star]").textContent = "☆";
    }

    clone.querySelector("[data-field=star]").addEventListener("click", clickStar);

    function clickStar() {
      if (animal.star === true) {
        animal.star = false;
      } else {
        animal.star = true;
      }

      //buildList();
    }

    // set clone data for TROPFY
    clone.querySelector("[data-field=trophy]").dataset.trophy = student.trophy;
    clone.querySelector("[data-field=trophy]").addEventListener("click", clickTrophy);

    function clickTrophy() {
      if (student.trophy === true) {
        student.trophy = false;
      } else {
        //tryToMakeATrophyr(student);
      }

      //buildList();
    }
    container.appendChild(clone);
  });
}
