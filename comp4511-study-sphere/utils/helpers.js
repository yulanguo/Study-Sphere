function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength == 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

export const filterFn = (search, key, name) => {
  return (
    search.trim() === "" ||
    similarity(key, search.trim().toLowerCase()) >= 0.3 ||
    key.includes(search.trim().toLowerCase()) ||
    search.trim().toLowerCase().includes(key) ||
    similarity(name.toLowerCase(), search.trim().toLowerCase()) >= 0.3 ||
    name.toLowerCase().includes(search.trim().toLowerCase()) ||
    search.trim().toLowerCase().includes(name.toLowerCase())
  );
};

export const myCoursesOnly = (myId, courses) => {
  const retval = {};
  for (const key of Object.keys(courses)) {
    if (courses[key].participants.includes(myId)) {
      retval[key] = courses[key];
    }
  }
  return retval;
};

export const myClassesOnly = (myId, classes) => {
  const retval = {};
  for (const key of Object.keys(classes)) {
    if (classes[key].participants.includes(myId)) {
      retval[key] = classes[key];
    }
  }
  return retval;
};

/**
   * The following function takes the time format given in the date picker
   * and converts it to a string that has it well formatted
   * @param {*} hrs
   * @param {*} min
   * @returns
   */
export const formatTime = (hrs, min) => {
  let hour = hrs % 12 || 12;
  const minute = min < 10 ? `0${min}` : min;
  const timeOfDay = hrs < 12 ? 'AM' : 'PM';

  return `${hour}:${minute} ${timeOfDay}`;
};
