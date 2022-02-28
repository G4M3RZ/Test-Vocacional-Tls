const AddAnswer = (id, value) =>
{
    json_survey.answers.push({"question_id" : id, "answer": value });
    // console.log(json_survey);
}
const AddCategory = (index) =>
{
    json_session.category[index - 1] += 1;
    // console.log(json_session.category);
    SelectVocation();
}
const SaveProgress = () =>
{
    window.sessionStorage.setItem('survey', JSON.stringify(json_survey));
    // console.log(json_survey);
    window.sessionStorage.setItem('progress', JSON.stringify(json_session));
    // console.log(json_session);
}
const PostSurvey = () =>
{
    SaveProgress();
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
let survey = JSON.parse(window.sessionStorage.getItem('survey'));
// console.log(survey);

let session = JSON.parse(window.sessionStorage.getItem('progress'));
// console.log(session);

var json_survey = {};

//test
json_survey.code = 0;
json_survey.name = 'Pedro Picapiedra';

var json_session = {};
let gameQuestions = 6;

if(survey == null || session == null)
{
    //Survey
    json_survey.survey_id = 0;
    json_survey.answers = [];

    //Session
    json_session.questions = [];
    json_session.category = [0, 0, 0, 0, 0, 0, 0];
    //en caso de requerir mostrar las dos categorias, hacer 2 Arrays de category (intereses/aptitudes)
    json_session.playing = false;

    json_session.total = 0;
    json_session.current = 0;
    json_session.progress = 0;

    fetch('https://tlsvocacional.renzoguido.com/api/survey',
    {
        method: 'GET',
        headers: { 'Content-type': 'application/json' }
    })
    .then((response) => response.json())
    .then((data) =>
    {
        // console.log(data);

        json_survey.survey_id = data.survey.id;
        json_session.questions = data.survey.questions;

        json_session.total = json_session.questions.length - (gameQuestions * (levels.length - 2));
        shuffleArray(json_session.questions);
        // console.log(json_session.questions);

        //Set first box text
        SetBoxText(box1, json_session.questions[json_session.current].title);
    })
    .catch(error => 
    {
        console.error(error);
        if(!alert('Connection Error')) window.location.reload();
    });
}
else
{
    json_survey = survey;
    json_session = session;

    SetMiniGame();
    SelectVocation();
    SetProgressBar(false);

    if(json_session.current < json_session.questions.length - 1)
    {
        SetBoxText(box1, json_session.questions[json_session.current].title);
    }
}