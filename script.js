"use strict";

window.addEventListener("DOMContentLoaded", start);

//url with JSON data
const url = "https://petlatkea.dk/2021/hogwarts/students.json";

//array where the new object should get stored in
const allStudents = [];

//array where we can add the students who gets expelled
const expelledStudents = [];

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
  blood: "",
  star: false,
  trophy: false,
  isExpelled: false,
  crest: "",
};

const settings = {
  filter: "all",
  sortBy: "firstName",
  sortDir: "asc",
};

function start() {
  console.log("ready");

  addingEventListeners();
  loadJSON();
}

function addingEventListeners() {
  document.querySelectorAll("[data-action='filter']").forEach((option) => option.addEventListener("click", selectFilter));

  document.querySelectorAll("[data-action='sort']").forEach((option) => option.addEventListener("click", selectSort));

  document.querySelectorAll("[data-action='search']").forEach((option) => option.addEventListener("input", selectSearch));
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
    //no last name  --- have to do ---

    //Getting the GENDER and making it upper case.
    student.gender = gender.substring(0, 1).toUpperCase() + gender.substring(1).toLowerCase();

    //Getting the HOUSE NAME and making it upper case.
    student.house = house.substring(0, 1).toUpperCase() + house.substring(1).toLowerCase();

    //Getting the IMAGE URL by the lastname in lowercase + _ + the first letter of the first name and the .png.
    student.image = fullName.substring(fullName.lastIndexOf(" ")).trim().toLowerCase() + "_" + fullName.substring(0, 1).toLowerCase() + ".png";
    //getting img url with full first name  --- have to do ---

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

//------ Practical infor displayed -----------//
function showInfo() {
  //console.log("yaaaas");
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

  setSearch(search);
}

function setSearch(search) {
  search = search.toLowerCase();

  console.log(search);
  buildList();
}

/* function searchList(searchedList) {
  if (search === "Firstname") {
    searchedList = allStudents.filter(isFirstname);
  } else if (search === "Lastname") {
    searchedList = allStudents.filter(isLastname);
  }
  return searchedList;
}

function isFirstname(student) {
  return student.firstName === "Firstname";
}

function isLastname(student) {
  return student.lastName === "Lastname";
} */

//------Displaying all the students in list view and popup-----------//
function buildList() {
  let currentList = filterList(allStudents);
  currentList = sortList(currentList);

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

    // set clone data for STAR
    if (student.star === true) {
      clone.querySelector("[data-field=star]").textContent = "⭐";
    } else {
      clone.querySelector("[data-field=star]").textContent = "☆";
    }

    clone.querySelector("[data-field=star]").addEventListener("click", clickStar);

    function clickStar() {
      if (student.star === true) {
        student.star = false;
      } else {
        student.star = true;
      }

      buildList();
    }

    // set clone data for TROPHY
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
      student.isExpelled = !student.isExpelled;

      //find student's position in allStudents
      const index = allStudents.findIndex((element) => {
        if (element === student) {
          return true;
        }
        return false;
      });

      //use student's position to splice student fra allStudents
      if (index !== -1) {
        const splicedArray = allStudents.splice(index, 1);
        const foundElement = splicedArray[0];

        //add student to expelledStudents
        expelledStudents.push(foundElement);
      }
      console.log("array1", allStudents);
      console.log("array2", expelledStudents);

      buildList();
    }

    clone.querySelector("[data-field=fullname]").addEventListener("click", () => showPopUp(student));
    container.appendChild(clone);
  });
}

function showPopUp(student) {
  console.log("we are pop'ing");
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
  const numberOfTrophies = trophies.length;
  const other = trophies.filter((student) => student.gender === selectedStudent.gender).shift();

  //check if there is another of the same type selected.
  if (other !== undefined) {
    removeOther(other);
  } else if (numberOfTrophies >= 2) {
    removeAorB(trophies[0], trophies[1]);
  } else {
    makeWinner(selectedStudent);
  }

  function removeOther(other) {
    //ask the user to ignore or remove the "other".
    document.querySelector("#remove_other").classList.remove("hide");
    document.querySelector("#remove_other .close_button").addEventListener("click", closeDialog);
    document.querySelector("#remove_other #removeother_button").addEventListener("click", clickRemoveOther);

    //Show the selected animal name on the button:
    document.querySelector("#remove_other [data-field=otherwinner]").textContent = other.name;

    //if user ignores then do nothing..
    function closeDialog() {
      //adding hide so the dialog box will be hidden when the user close the dialog box:
      document.querySelector("#remove_other").classList.add("hide");
      //remembering to remove eventListeners again:
      document.querySelector("#remove_other .close_button").removeEventListener("click", closeDialog);
      document.querySelector("#remove_other #removeother_button").removeEventListener("click", clickRemoveOther);
    }

    //if remove the "other" do this:
    function clickRemoveOther() {
      removeWinner(other);
      makeWinner(selectedStudent);

      buildList();
      closeDialog();
    }
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
