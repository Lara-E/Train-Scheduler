
firebase.initializeApp(config);

var database = firebase.database();
var now = moment().format("hh:mm A");


setInterval(function() {
    $("#current-time").html(now)
    }, 1000);

    $("#submit").on("click", function (event) {
        event.preventDefault();
        var name = $("#train-name").val().trim();
        var destination = $("#destination").val().trim();
        var first = moment($("#first-train").val().trim(), "hh:mm A").format("hh:mm A")
        console.log(first)
        var frequency = $("#frequency").val().trim();
        database.ref().push({
            name: name,
            destination: destination,
            first: first,
            frequency: frequency,
        })
        $("#train-name").val("");
        $("#destination").val("");
        $("#first-train").val("");
        $("#frequency").val("");
    });

    database.ref().on("child_added", function (snapshot) {
        var newTrain = snapshot.val();
        var row = $("<tr>");
        var trainFrequency = newTrain.frequency;
        var firstTrain = newTrain.first
        var firstTrainConverted = moment(firstTrain, "hh:mm A");
        var currentTime = moment();
        console.log(currentTime)
        var diffTime = currentTime.diff(moment(firstTrainConverted), "minutes");
        var timeRemainder = diffTime % trainFrequency;
        var minutesAway = trainFrequency - timeRemainder;
        var nextArrival
        var isAfter = firstTrainConverted.isAfter(currentTime)

        if (isAfter) {
            nextArrival = firstTrain;
            minutesAway = firstTrainConverted.diff(moment(), "minutes");
        }
        else {
            nextArrival = moment().add(minutesAway, "minutes").format("hh:mm A");
        }
        row.append($("<td>").text(newTrain.name));
        row.append($("<td>").text(newTrain.destination));
        row.append($("<td>").text(newTrain.frequency));
        row.append($("<td>").text(nextArrival));
        row.append($("<td>").text(minutesAway));
        $("tbody").append(row);
    });

