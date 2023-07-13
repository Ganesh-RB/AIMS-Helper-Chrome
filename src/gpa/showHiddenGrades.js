const gradeFilterPath = "https://aims.iith.ac.in/aims/courseReg/loadMyCoursesHistroy";
const allPossibleGrades = ['A+', 'A', 'A-', 'B', 'B-', 'C', 'C-', 'D', 'I', "S", 'U', 'AU', 'F', 'FR', 'FS'];

/**
 * Function to insert a given grade at the given element
 *
 */
const insertGrade = (courseId, gradeId) => {
    const elems = document.querySelectorAll('.hierarchyLi.dataLi.tab_body_bg');
    elems.forEach((eachCourse) => {
        if (eachCourse.childNodes.length < 9) return;
        const eachCourseId = eachCourse.childNodes[0].innerText.trim();
        if (eachCourseId === courseId) {
            const grade = allPossibleGrades[gradeId - 1];
            eachCourse.childNodes[7].setHTML(`&nbsp;${grade}`);
            eachCourse.childNodes[7].style.color = "red";
            eachCourse.childNodes[7].title = "Added by AIMS Helper Extension";
        }
    });

};

const buildFilterURL = (studentId, gradeId) => {
    return gradeFilterPath + "?studentId=" + studentId + "&courseCd=&courseName=&orderBy=1&degreeIds=&acadPeriodIds=&regTypeIds=&"
        + "gradeIds=" + encodeURI(`["${gradeId}"]`) + "&resultIds=&isGradeIds=";
};

const getCoursesWithHiddenGrade = async (studentId, gradeId) => {
    const url = buildFilterURL(studentId, gradeId);
    const coursesWithHiddenGrades = [];

    await fetch(url).then(r => r.text()).then(result => {
        try {
            courses = JSON.parse(result)
        } catch (error) {
            console.log(error, gradeId, result);
            return null;
        }
        courses.forEach(course => {
            if (!course["gradeDesc"]) {
                coursesWithHiddenGrades.push(course)
            }
        })
    })
    return coursesWithHiddenGrades;
};

const showHiddenGrades = () => {

    const studentId = window.studentId;

    allPossibleGrades.forEach(async (grade, index) => {
        const gradeId = index + 1;
        const coursesWithHiddenGrades = await getCoursesWithHiddenGrade(studentId, gradeId);

        coursesWithHiddenGrades.forEach((course) => {
            insertGrade(course["courseCd"], gradeId);
        })
    });
};

document.addEventListener('readystatechange', event => {
    switch (document.readyState) {
        case "complete":
            setTimeout(() => {
                showHiddenGrades();
            }, 3000);
            break;
    }
});