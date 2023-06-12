// Home Page
var selectedLanguageName;
var selectedAudio;
var selectedEnglishSummary;
var selectedInformation;
var selectedMap;
var questionCount;
var blankList = [];

onEvent("buttonPlay1", "click", function( ) {
	
	setScreen("screenGame");
  setProperty("textInformation", "text", "");
	
	buttonUpdate(blankList);

	questionCount = 0;
	
	readRecords("Languages", {Status:"Selected"}, function(records) {
	  for(var i=0; i < records.length; i++) {
	    var updatedRecord = records[i];
      updatedRecord.Status = "Active";
      updateRecord("Languages", updatedRecord, function() {
	    });
	  }
	});
});

onEvent("buttonInstructions1", "click", function( ) {
	setScreen("screenInstruction");
});

onEvent("image1", "click", function( ) {
	setScreen("screenHome");
});

onEvent("image2", "click", function( ) {
	setScreen("screenHome");
});

onEvent("buttonPlayAudio", "click", function( ) {
  
  //Initialize a blank list for storing language options
  var languageOptionsList = [];
  
  //Increment the question count
  questionCount = questionCount + 1;
  
  readRecords("Languages", {Status:"Active"}, function(activeLanguages) {
    
    var randomLanguageIDSelected = randomNumber(1,activeLanguages.length - 1);

    if (activeLanguages.length>=4) {
      //Check if random id generated is an active record in the dataset, else regenerate 
      //(it could be possible that the random id generated is a record that is not 'Active')
      for (var i = 0; i < activeLanguages.length; i++) {
        if (randomLanguageIDSelected == activeLanguages[i].LanguageID) {
          i = activeLanguages.length - 1;
        } else {
          if (i == activeLanguages.length - 1) {
            randomLanguageIDSelected = randomNumber(1,activeLanguages.length - 1);
            i = 0;
          }
        }
      }
      //Now you have a selected a language. Change the status of this language id to 'Selected'
      var updatedRecord = activeLanguages[randomLanguageIDSelected];
      updatedRecord.Status = "Selected";
      updateRecord("Languages", updatedRecord, function() {
      });
      
      //Store the parameters of the selected language in the global variables
      selectedLanguageName = activeLanguages[randomLanguageIDSelected].LanguageName;
      selectedAudio = activeLanguages[randomLanguageIDSelected].Audio;
      selectedEnglishSummary = activeLanguages[randomLanguageIDSelected].EnglishSummary;
      selectedInformation = activeLanguages[randomLanguageIDSelected].Information;
      selectedMap = activeLanguages[randomLanguageIDSelected].Map;
      
      //Append the selected language to the answer options list
      appendItem(languageOptionsList, selectedLanguageName);
      //console.log(languageOptionsList);
    }
    else {
      write("Need 4 active records");
    }      
  });
  
  //Now we will generate the three other options
  var randomLanguageIDOption;
  //This flag is to check for duplicates in the options list 
  var flag = false;
  
  //Fetch 3 more Languages that are not 'Selected' state
  readRecords("Languages", {Status:"Active"}, function(records){
    //This while loop will keep executing till the list has 4 items
    while (languageOptionsList.length < 4) {
      flag = false;
      randomLanguageIDOption = randomNumber(0, records.length - 1);
      //console.log("randomLanguageIDOption = " +randomLanguageIDOption);
      
      //Check for duplicates in the options list by using the flag
      for (var i = 0; i < records.length-1; i++) {
        if (records[randomLanguageIDOption].LanguageName == languageOptionsList[i]) {
           flag = true;
        }
      }
      
      if (flag == false) {
        //console.log(randomLanguageID);
        appendItem(languageOptionsList, records[randomLanguageIDOption].LanguageName);     
      }
    }
    
    var languageOptionsListShuffled = [];
    
    var randomIndex;
    
    for (var j = 0; j < 4; j++) {
      randomIndex = randomNumber(0, languageOptionsList.length - 1);
      appendItem(languageOptionsListShuffled, languageOptionsList[randomIndex]);
      removeItem(languageOptionsList,randomIndex);
      
    }
    
    buttonUpdate(languageOptionsListShuffled);
    
  });
});

onEvent("buttonPlayAudio", "click", function( ) {
  console.log("Audio Clip Playing");
  //playSound("https://audio.code.org/win3.mp3", true);
  //playSound("C:\Ajay\Official Data\Microsoft\WORK\OneDrive - Microsoft\Desktop\LanguageClips\0703 (1).mp3", true);
  //open("https://microsoft-my.sharepoint.com/:u:/p/ajaynair/ESwhVbW0XxdMrYpWyqYlWw0BJHcSE72q5W8UpmiOEWKDiQ?e=DUMQdf");
  setProperty("textInformation", "text", selectedEnglishSummary);
});

onEvent("buttonOption1", "click", function( ) {
	setScreen("screenResults");
	var chosenOption = getProperty("buttonOption1", "text");
	checkResults(chosenOption);
});

onEvent("buttonOption2", "click", function( ) {
	setScreen("screenResults");
	var chosenOption = getProperty("buttonOption2", "text");
	checkResults(chosenOption);
});

onEvent("buttonOption3", "click", function( ) {
	setScreen("screenResults");
	var chosenOption = getProperty("buttonOption3", "text");
	checkResults(chosenOption);
});

onEvent("buttonOption4", "click", function( ) {
	setScreen("screenResults");
	var chosenOption = getProperty("buttonOption4", "text");
	checkResults(chosenOption);
});

onEvent("buttonNextLanguage", "click", function( ) {
	//Check if 5 questions have been answered
  console.log("Question Count = " +questionCount);
  if (questionCount == 5) {
      setScreen("screenGameOver");
  } else {
    setScreen("screenGame");
    
	  setProperty("textInformation", "text", "");
	  buttonUpdate(blankList);
	  
	  //setProperty("buttonOption1", "text", "");
    //setProperty("buttonOption2", "text", "");
    //setProperty("buttonOption3", "text", "");
    //setProperty("buttonOption4", "text", "");
  }
});

function checkResults (chosenOption) {
  if (chosenOption == selectedLanguageName) {
	  setProperty("labelResults", "text", "Congratulations! You have identified the language correctly! Please check additional details about the language below");	  
	} else {
	  setProperty("labelResults", "text", "Sorry! You have not identified the language correctly! Please check additional details about the language below");
	}
  setProperty("labelMap", "text", selectedMap);	  
	setProperty("labelInformation", "text", selectedInformation);	  
}

function buttonUpdate(optionsList) {
  for (var i=1; i<5; i++) {
    if (optionsList.length > 0) {
      setProperty("buttonOption" +i, "text", optionsList[i-1]);
    } else {
      setProperty("buttonOption" +i, "text", "");
    }
  }
}

onEvent("image3", "click", function( ) {
	setScreen("screenHome");
});
