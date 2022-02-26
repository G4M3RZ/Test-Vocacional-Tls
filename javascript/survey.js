var json_survey = {};

//User Data
json_survey.code = 0;
json_survey.name = 'Pedro Picapiedra';

//Survey Values
json_survey.survey_id = 0;
json_survey.answers = [];

const AddAnswer = (id, value) =>
{
    json_survey.answers.push({"question_id" : id, "answer": value });
    // console.log(json_survey);
}
const AddCategory = (index) =>
{
    web_category[index - 1] += 1;
    // console.log(web_category);
}
const PostSurvey = () =>
{
    orderArray(json_survey.answers);
    console.log(json_survey);

    // fetch('https://tlsvocacional.renzoguido.com/api/survey',
    // {
    //     method: 'POST',
    //     headers: { 'Content-type': 'application/json' },
    //     body: JSON.stringify(json_survey)
    // })
    // .then((response) => response.json())
    // .then((values) => console.log(values));
};

//----------------------Get Survey----------------------
var web_questions;
var web_category = [0, 0, 0, 0, 0, 0, 0];

let gameQuestions = 1;
let totalQuestions = 0;
let currentQuestion = 0;

fetch('https://tlsvocacional.renzoguido.com/api/survey',
{
    method: 'GET',
    headers: { 'Content-type': 'application/json' }
})
.then((response) => response.json())
.then((data) =>
{
    json_survey.survey_id = data.survey.id;
    web_questions = data.survey.questions;

    totalQuestions = web_questions.length - (gameQuestions * (levels.length - 2));
    shuffleArray(web_questions);
    console.log(web_questions);

    //Set first box text
    SetBoxText(box1, web_questions[currentQuestion].title);
})
.catch(error => 
{
    if(!alert('Connection Error: ' + error)) window.location.reload();
});