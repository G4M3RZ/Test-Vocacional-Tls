//----------------------Survey----------------------
let survey = JSON.parse(window.sessionStorage.getItem('survey'));
let session = JSON.parse(window.sessionStorage.getItem('progress'));

var json_survey = {};
var json_session = {};

let gameQuestions = 6;

//Survey
json_survey.survey_id = 0;
json_survey.answers = [];

//Session
json_session.questions = [];
json_session.category = [];
json_session.amount = [0, 0, 0, 0, 0, 0, 0];

json_session.playing = false;

json_session.total = 0;
json_session.current = 0;
json_session.progress = 0;

if(survey != null && session != null)
{
    json_survey = survey;
    json_session = session;

    SetMiniGame();
    SelectVocation();
    SetProgressBar(false);
    
    if(json_session.current < json_session.questions.length - 1)
    {
        ChangeViewState(loginView, surveyView);
        SetBoxText(box1, json_session.questions[json_session.current].title);
    }
    else
    {
        ChangeViewState(loginView, resultView);
    }
}

const AddAnswer = (id, value) =>
{
    json_survey.answers.push(
    {
        "question_id" : id,
        "answer": value
    });
};
const AddCategory = (id) =>
{
    const index = json_session.category.indexOf(id);
    json_session.amount[index] += 1;
    // console.log(json_session.amount);

    SelectVocation();
}
const SaveProgress = () =>
{
    window.sessionStorage.setItem('survey', JSON.stringify(json_survey));
    window.sessionStorage.setItem('progress', JSON.stringify(json_session));
}

function GetSurvey ()
{
    //Set User Values
    json_survey.code = user.code;
    json_survey.name = user.name;

    fetch('https://tlsvocacional.renzoguido.com/api/survey',
    {
        method: 'GET',
        headers: { 'Content-type': 'application/json' }
    })
    .then((response) => response.json())
    .then((result) =>
    {
        //Json
        // console.log(result);

        //Survey
        json_survey.survey_id = result.survey.id;

        //Session
        json_session.questions = result.survey.questions;
        json_session.category = idArray(result.survey.areas);
        json_session.total = json_session.questions.length - (gameQuestions * (levels.length - 2));
        
        //Random Questions
        shuffleArray(json_session.questions);
        console.log(json_session.questions);

        if(json_session.questions.length != 0)
        {
            ChangeViewState(loginView, surveyView);
            SetBoxText(box1, json_session.questions[json_session.current].title);
        }
        else
        {
            errorMessage.innerHTML = 'Survey Error';
        }
    })
    .catch(error =>
    {
        console.error(error);
        if(!alert('Connection Error')) window.location.reload();
    });
};
function SendSurvey ()
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