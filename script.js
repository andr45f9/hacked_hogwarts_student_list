"use strict";

window.addEventListener("DOMContentLoaded", start);

//url with JSON data.
const studentsURL = "https://petlatkea.dk/2021/hogwarts/students.json";
const familiesURL = "https://petlatkea.dk/2021/hogwarts/families.json";

const allStudents = []; //array where the new object should get stored in.
const expelledStudents = []; //array where we can add the students who gets expelled.

let searchArray = []; //array for storing all the students who get searched for.
let houseAmountArray = []; //array storing the different all students filtered by house, so we later can count how many students are in each house.

//These variables will later on hold the json files from studentaURL and familiesJSON.
let studentJSON;
let familyJSON;

let isHacked = false;

//Object with new "cleaned" data.
const Student = {
  firstName: "",
  lastName: "",
  middleName: "undefined",
  nickName: "undefined",
  image: "",
  house: "",
  gender: "",
  blood: "",
  star: false,
  trophy: false,
  isExpelled: false,
  crest: "",
};

const MyObject = {
  firstName: "Andrea Marie",
  middelName: "Roed",
  nickName: "undefined",
  lastName: "Schack",
  house: "Hufflepuff",
  gender: "Girl",
  blood: "Muggle",
  star: false,
  trophy: false,
  isExpelled: false,
};

const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

async function start() {
  console.log("ready");

  await loadStudentJSON();
  await loadFamilyJSON();

  addingEventListeners();
}

function addingEventListeners() {
  document.querySelectorAll("[data-action='filter']").forEach((option) => option.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach((option) => option.addEventListener("click", selectSort));

  document.querySelectorAll("[data-action='search']").forEach((option) => option.addEventListener("input", selectSearch));

  document.querySelector("#secret_button").addEventListener("click", hackTheSystem);
}

async function loadStudentJSON() {
  const response = await fetch(studentsURL);
  const json = await response.json();

  studentJSON = json;

  // when loaded, prepare objects
  prepareStudents(studentJSON);
}

async function loadFamilyJSON() {
  const response = await fetch(familiesURL);
  const json = await response.json();

  familyJSON = json;

  // when loaded, prepare objects
  prepareBloodStatus(familyJSON);
}

//------CLEANING the data and defining it----------- students and blood status.
function prepareStudents(studentJSON) {
  studentJSON.forEach((studentObject) => {
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

    //Getting the GENDER and making it upper case.
    student.gender = gender.substring(0, 1).toUpperCase() + gender.substring(1).toLowerCase();

    //Getting the HOUSE NAME and making it upper case.
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();

    //Getting the IMAGE URL by the lastname in lowercase + _ + the first letter of the first name and the .png.
    student.image = fullName.substring(fullName.lastIndexOf(" ")).trim().toLowerCase() + "_" + fullName.substring(0, 1).toLowerCase() + ".png";

    //Getting the HOUSE CREST IMAGE URL
    student.crest = house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase() + ".png";

    //storing our new object in the allStudents array.
    allStudents.push(student);
  });

  //Displaying the students array as a table in the console.
  //console.table(allStudents);

  showInfo();
  buildList();
}

function prepareBloodStatus(bloodArray) {
  allStudents.forEach((student) => {
    student.blood = "Muggle";
    if (bloodArray.half.includes(student.lastName)) {
      student.blood = "Half-blood";
    } else if (bloodArray.pure.includes(student.lastName)) {
      student.blood = "Pure-blood";
    } else if (bloodArray.half.includes(student.lastName) && bloodArray.pure.includes(student.lastName)) {
      student.blood = "Pure-blood";
    } else {
      student.blood = "Muggle";
    }
  });

  buildList();
}

//------HACK the system----------- Insert myself into the students list, mess up the blood status and make myself un-expellable.
function hackTheSystem() {
  if (!isHacked) {
    console.log("Hacking the systems ...");

    addMyObject();

    isHacked = true;
    document.querySelector("body").style.backgroundColor = "#F18759";

    hackBlood();

    //set interval kalder remove inquisitorial function
    setInterval(removeStar, 10000);

    buildList();
  } else {
    console.log("Systems are already hacked! access denied");
  }
}

function removeStar() {
  allStudents.forEach((student) => {
    //fjern inquisitorial status
    if (student.star) {
      student.star = false;
    }
  });

  buildList();
}

function addMyObject() {
  const myself = Object.create(MyObject); //create my own object with my data in it.

  //storing my own object in the allStudents array by pushing it, so I can be seen on the students list.
  allStudents.push(myself);
}

function hackBlood() {
  allStudents.forEach(changeBlood);

  buildList();
}

function changeBlood(student) {
  const number = Math.floor(Math.random() * 3) + 1;

  if (student.blood === "Muggle" || student.blood === "Half-blood") {
    student.blood = "Pure-blood";
  } else if (number === 1) {
    student.blood = "Muggle";
  } else if (number === 2) {
    student.blood = "Half-blood";
  } else {
    student.blood = "Pure-blood";
  }

  buildList();
}

//------ALL filtering----------- Filtering by house or expelled students/non-expelled and all students.
function selectFilter(event) {
  const filter = event.target.dataset.filter;

  console.log(`User selected: ${filter}`);

  setFilter(filter);
}

function setFilter(filter) {
  settings.filterBy = filter;

  buildList();
}

function filterList(filteredList) {
  //Filter by house and expelled students

  if (settings.filterBy === "Gryffindor") {
    filteredList = allStudents.filter(isGryffindor);
  } else if (settings.filterBy === "Ravenclaw") {
    filteredList = allStudents.filter(isRavenclaw);
  } else if (settings.filterBy === "Hufflepuff") {
    filteredList = allStudents.filter(isHufflepuff);
  } else if (settings.filterBy === "Slytherin") {
    filteredList = allStudents.filter(isSlytherin);
  } else if (settings.filterBy === "Prefect") {
    filteredList = allStudents.filter(isPrefect);
  } else if (settings.filterBy === "Expelled") {
    filteredList = expelledStudents.filter(isExpelled);
  } else if (settings.filterBy === "NonExpelled") {
    filteredList = allStudents.filter(isNonExpelled);
  }

  return filteredList;
}

function isGryffindor(student) {
  return student.house === "Gryffindor";
}

function isRavenclaw(student) {
  return student.house === "Ravenclaw";
}

function isHufflepuff(student) {
  return student.house === "Hufflepuff";
}

function isSlytherin(student) {
  return student.house === "Slytherin";
}

function isPrefect(student) {
  if (student.trophy === true) {
    student.trophy === "Prefect";
  }

  return student.trophy;
}

function isExpelled(student) {
  return student.isExpelled;
}

function isNonExpelled(student) {
  return !student.isExpelled;
}

//------ALL sorting----------- Sort by firt and last name from a-z and z-a and student in same house.
function selectSort(event) {
  const sortBy = event.target.dataset.sort;
  const sortDir = event.target.dataset.sortDirection;

  console.log(`User selected: ${sortBy} - ${sortDir}`);
  setSort(sortBy, sortDir);
}

function setSort(sortBy, sortDir) {
  settings.sortBy = sortBy;
  settings.sortDir = sortDir;

  buildList();
}

function sortList(sortedList) {
  let direction = 1;

  if (settings.sortDir === "desc") {
    direction = -1;
  } else {
    direction = 1;
  }

  sortedList = sortedList.sort(sortByProperty);

  function sortByProperty(studentA, studentB) {
    if (studentA[settings.sortBy] < studentB[settings.sortBy]) {
      return -1 * direction;
    } else {
      return 1 * direction;
    }
  }
  return sortedList;
}

//------ALL search bar----------- Search on firstname and lastname.

function selectSearch(event) {
  let search = event.target.value;
  searchArray = allStudents.filter(searchTerm);

  function searchTerm(student) {
    if (student.lastName && student.firstName.toLowerCase().includes(search)) {
      return true;
    } else if (student.firstName.toLowerCase().includes(search) || student.lastName.toLowerCase().includes(search)) {
      return true;
    } else return false;
  }

  displayStudent(searchArray);
}

//------ Practical info about amount of students in each house -----------//
function showInfo() {
  //Shows how many students there are in each house.
  houseAmountArray = allStudents.filter(showHouseAmount);

  function showHouseAmount(student) {
    if (student.house === "Gryffindor") {
      document.querySelector(".gryffindor_value").textContent = student.house.length;
    } else if (student.house === "Ravenclaw") {
      document.querySelector(".ravenclaw_value").textContent = student.house.length;
    } else if (student.house === "Hufflepuff") {
      document.querySelector(".hufflepuff_value").textContent = student.house.length;
    } else if (student.house === "Slytherin") {
      document.querySelector(".slytherin_value").textContent = student.house.length;
    }

    displayStudent(houseAmountArray);
  }
}

//------Displaying all the students in list view and popup-----------//
function buildList() {
  let currentList = filterList(allStudents);
  currentList = sortList(currentList);

  //Shows amount of students who are expelled
  document.querySelector(".expelled_value").textContent = expelledStudents.length;

  //Shows amount of students who are NOT expelled
  document.querySelector(".non_expelled_value").textContent = allStudents.length;

  //Amount of students currently displayed (number cahnges everytime the list gets changed)
  document.querySelector(".amount_displayed").textContent = currentList.length;

  displayStudent(currentList);
}

function displayStudent(allStudents) {
  const container = document.querySelector(".list_container");
  container.innerHTML = "";

  allStudents.forEach((student) => {
    const template = document.querySelector("#student_list");
    let clone = template.cloneNode(true).content;

    clone.querySelector("[data-field=fullname]").textContent = student.firstName + " " + student.lastName;
    clone.querySelector("[data-field=house]").textContent = student.house;

    // set clone data for STAR/Inquisitorial squad
    if (student.star === true) {
      clone.querySelector("[data-field=star]").textContent = "⭐";
    } else {
      clone.querySelector("[data-field=star]").textContent = "☆";
    }

    clone.querySelector("[data-field=star]").addEventListener("click", clickStar);

    function clickStar() {
      if (student.star === true) {
        student.star = false;
      } else if (student.house === "Slytherin" || student.blood === "Pure-blood") {
        makeStar(student);
      } else {
        student.star = false;
        alert("Only pure-blooded students from Slytherin can join the Inquisitorial Squad!");
      }

      buildList();
    }

    function makeStar(chosenStudent) {
      chosenStudent.star = true;
    }

    // set clone data for TROPHY/Prefect
    clone.querySelector("[data-field=trophy]").dataset.trophy = student.trophy;
    clone.querySelector("[data-field=trophy]").addEventListener("click", clickTrophy);

    function clickTrophy() {
      if (student.trophy === true) {
        student.trophy = false;
      } else {
        tryToMakeAWinner(student);
      }

      buildList();
    }

    // set clone data for EXPELL button
    if (student.isExpelled) {
      clone.querySelector(".expel_button").textContent = "Expelled";
    } else {
      clone.querySelector(".expel_button").textContent = "Expel";
    }

    clone.querySelector(".expel_button").addEventListener("click", clickExpelBtn);

    function clickExpelBtn() {
      if (student.lastName !== "Schack") {
        student.isExpelled = !student.isExpelled;

        //find student's position in allStudents
        const index = allStudents.findIndex((element) => {
          if (element === student) {
            return true;
          } else {
            return false;
          }
        });

        //use student's position to splice student fra allStudents
        if (index !== -1) {
          const splicedArray = allStudents.splice(index, 1);
          const foundElement = splicedArray[0];

          //add student to expelledStudents
          expelledStudents.push(foundElement);
        }
      } else {
        alert("YOU CAN'T EXPEL ME SUCKEEER!");
        console.log("YOU CAN'T EXPEL ME SUCKEEER!");
      }

      buildList();
    }

    clone.querySelector("[data-field=fullname]").addEventListener("click", () => showPopUp(student));
    container.appendChild(clone);
  });
}

function showPopUp(student) {
  const popup = document.querySelector("#popUp");
  popup.style.display = "block";

  popup.querySelector(".profile_pic").src = `images/${student.image}`;
  popup.querySelector(".firstname").textContent = `First name: ${student.firstName}`;
  popup.querySelector(".middlename").textContent = `Middle name: ${student.middelName}`;
  popup.querySelector(".nickname").textContent = `Nick name: ${student.nickName}`;
  popup.querySelector(".lastname").textContent = `Last name: ${student.lastName}`;
  popup.querySelector(".gender").textContent = `Gender: ${student.gender}`;

  popup.querySelector(".blood_status").textContent = `Blood status: ${student.blood}`;
  popup.querySelector(".expelled_status").textContent = `Expelled: ${student.expelled}`;
  popup.querySelector(".prefect").textContent = `Prefect: ${student.trophy}`;
  popup.querySelector(".inquisitorial").textContent = `Inquisitorial Squad: ${student.star}`;
  popup.querySelector(".crest_pic").src = `crest_img/${student.crest}`;

  //Making sure that each student gets a popup window with the right colors of their crest/house.
  if (student.house === "Gryffindor") {
    document.querySelector("#popUp article").style.backgroundColor = "#6C1A32";
    document.querySelector(".popup_info_1").style.backgroundColor = "#D77E02";
    document.querySelector(".popup_info_2").style.backgroundColor = "#D77E02";
    document.querySelector("#close_button").style.backgroundColor = "#D77E02";
  } else if (student.house === "Hufflepuff") {
    document.querySelector("#popUp article").style.backgroundColor = "#BB7624";
    document.querySelector(".popup_info_1").style.backgroundColor = "#EDAB54";
    document.querySelector(".popup_info_2").style.backgroundColor = "#EDAB54";
    document.querySelector("#close_button").style.backgroundColor = "#EDAB54";
  } else if (student.house === "Ravenclaw") {
    document.querySelector("#popUp article").style.backgroundColor = "#063F53";
    document.querySelector(".popup_info_1").style.backgroundColor = "#7C9ABF";
    document.querySelector(".popup_info_2").style.backgroundColor = "#7C9ABF";
    document.querySelector("#close_button").style.backgroundColor = "#7C9ABF";
  } else if (student.house === "Slytherin") {
    document.querySelector("#popUp article").style.backgroundColor = "#164731";
    document.querySelector(".popup_info_1").style.backgroundColor = "#838E86";
    document.querySelector(".popup_info_2").style.backgroundColor = "#838E86";
    document.querySelector("#close_button").style.backgroundColor = "#838E86";
  }

  document.querySelector("#close_button").addEventListener("click", () => (popUp.style.display = "none"));
}

function tryToMakeAWinner(selectedStudent) {
  const trophies = allStudents.filter((student) => student.trophy === true);

  const otherSameHouse = trophies.filter((student) => student.house === selectedStudent.house);

  if (otherSameHouse.length >= 2) {
    removeAorB(otherSameHouse[0], otherSameHouse[1]);
  } else {
    makeWinner(selectedStudent);
  }

  function removeAorB(winnerA, winnerB) {
    //ask the user to ignore or remove A or B.
    document.querySelector("#remove_aorb").classList.remove("hide");
    document.querySelector("#remove_aorb .close_button").addEventListener("click", closeDialog);
    document.querySelector("#remove_aorb #remove_a").addEventListener("click", clickRemoveA);
    document.querySelector("#remove_aorb #remove_b").addEventListener("click", clickRemoveB);

    //Show the selected animals names on the buttons:
    document.querySelector("#remove_aorb [data-field=winnerA]").textContent = winnerA.firstName;
    document.querySelector("#remove_aorb [data-field=winnerB]").textContent = winnerB.firstName;

    //if user ignores then do nothing..
    function closeDialog() {
      //adding hide so the dialog box will be hidden when the user close the dialog box:
      document.querySelector("#remove_aorb").classList.add("hide");
      //remembering to remove eventListeners again:
      document.querySelector("#remove_aorb .close_button").removeEventListener("click", closeDialog);
      document.querySelector("#remove_aorb #remove_a").removeEventListener("click", clickRemoveA);
      document.querySelector("#remove_aorb #remove_b").removeEventListener("click", clickRemoveB);
    }

    //if removeA do this:
    function clickRemoveA() {
      removeWinner(winnerA);
      makeWinner(selectedStudent);

      buildList();
      closeDialog();
    }

    //else if removeB then:
    function clickRemoveB() {
      removeWinner(winnerB);
      makeWinner(selectedStudent);

      buildList();
      closeDialog();
    }
  }

  function removeWinner(winnerStudent) {
    winnerStudent.trophy = false;
  }

  function makeWinner(student) {
    student.trophy = true;
  }
}
