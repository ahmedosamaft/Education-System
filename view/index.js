const cardText = (code, cname, description, doctor, isRegistered) => `
  <div class="course">
    <h4 id="code">${code}</h4>
    <h5>${cname}</h5>
    <p>${description}</p>
    <p>Doctor: ${doctor}</p>
    ${
      !isRegistered
        ? `<button class="register-btn" value='register' onclick="enroll()">Register</button>`
        : `<button class="register-btn" value='register' onclick="unenroll()">Unregister</button>`
    } 
  </div>
`;
const year = 2022;

async function getRegisteredCourses() {
  let data = await fetch('http://localhost:8080/api/v1/enroll/', {
    headers: {
      authorization: 'Bearer ' + window.localStorage.getItem('token'),
    },
  });
  data = await data.json();
  return data.data.enrollments;
}

function enroll() {
  let code = event.target.parentElement.querySelector('#code').innerText;
  register('SPRING', code).catch((err) => console.log(err));
}

async function register(Csemester, code) {
  let data = await fetch('http://localhost:8080/api/v1/enroll/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + window.localStorage.getItem('token'),
    },
    body: JSON.stringify({
      code,
      semester: `${Csemester} ${year}`,
    }),
  });
  data = await data.json();
  console.log(data);
  window.location.reload();
}

function unenroll() {
  let code = event.target.parentElement.querySelector('#code').innerText;
  unregister('SPRING', code).catch((err) => console.log(err));
}

async function unregister(Csemester, code) {
  let data = await fetch('http://localhost:8080/api/v1/enroll/', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      authorization: 'Bearer ' + window.localStorage.getItem('token'),
    },
    body: JSON.stringify({
      code,
      semester: `${Csemester} ${year}`,
    }),
  });
  window.location.reload();
}

async function getCourses() {
  let enrollments = await getRegisteredCourses();
  console.log(enrollments);
  let registeredCourses = enrollments
    .filter((el) => parseInt(el.semester.split(' ')[1]) <= year)
    .map((el) => el.course.code);
  let data = await fetch('http://localhost:8080/api/v1/course/all', {
    headers: {
      authorization: 'Bearer ' + window.localStorage.getItem('token'),
    },
  });
  data = await data.json();
  let div = document.querySelector('.courses ul');
  let courses = data.data.courses;
  courses.forEach((course) => {
    let box = document.createElement('li');
    box.innerHTML += cardText(
      course.code,
      course.name,
      course.description,
      course.doctor.name,
      registeredCourses.includes(course.code)
    );
    div.appendChild(box);
  });
  console.log(data);
}
getCourses();
