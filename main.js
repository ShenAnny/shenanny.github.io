var max_row = 25
var max_col = 18
var data_array = []
var user_input_array = [] 
var data_row = 3
var debug = true
var good_fund = Math.floor(25*Math.random())//generate the good fund randomly
var profit_array = []
var temp_sum = 0
var market_array = []
var leave_it_blank = 0
var cumu_user_array = []
var cumu_market_array = []

// a row of data is data_array[data_row][j]. j is between 0~24
// so, 3 year display data will be store in data_array[0~2][0~24]
// next new data will be data_array[3], and next will be data_array[4]

// everytime user input will be read in user_input_array[i]. i is between 0~24. data will NOT be clear unless user clear the input boxs.

/**
 * for include javascript library using
 * 
 * @param {any} incFile 
 */
function includeJS(incFile) {
  document.write('<script type="text/javascript" src="' + incFile + '"></script>')
}
/*
function gaussianRand() {
  var rand = 0
  for (var i = 0; i < 4; i += 1)
    rand += Math.random()
  return rand / 4
}
function gaussianRandom(start, end) {
  return (start + gaussianRand() * (end - start + 1))
}
*/

/**
 * General normal random number by mean and S.D 
 * 
 * @param {any} mean : mean value
 * @param {any} stdev : S.D
 * @returns : a value(double)
 */
function normal_random(mean, stdev) {
  if (mean == undefined)
    mean = 0.0
  if (stdev == undefined)
    stdev = 1.0
  var V1, V2, S
  do {
    var U1 = Math.random()
    var U2 = Math.random()
    V1 = 2 * U1 - 1
    V2 = 2 * U2 - 1
    S = V1 * V1 + V2 * V2
  } while (S > 1)

  X = Math.sqrt(-2 * Math.log(S) / S) * V1
  //Y = Math.sqrt(-2 * Math.log(S) / S) * V2
  X = mean + Math.sqrt(stdev) * X
  //Y = mean + Math.sqrt(variance) * Y 
  return X
}

/**
 * This function will generate 3 years random datas.
 * modified
 */

function gen_3year_data(){
  var temp = 0
  for (var i = 0; i < 3; i++) {
    data_array.push([]);
    for (var j = 0; j < max_row; j++) {
      temp = 0
      temp += normal_random(5, Math.sqrt(200))
      if(j == good_fund){
        temp += normal_random(4, Math.sqrt(200))
      } else {
        temp += normal_random(0, Math.sqrt(200))
      }
      data_array[i].push(temp)
    }
  }

}

/**
 * this function will write data_array to HTML with input box on let
 * 
 * DO NOT coufuse row and col in html display, that is because we use 2D array but want to display each row in array to HTML in col
 */


function writeTable() {
  $('#tableBody').empty()
  // declare html variable (a string holder):
  var html = '<tr><th></th>';
  html += '<th>'+ 2 + ' Years ago</th>' 
  html += '<th>'+ 1 + ' Year ago</th>' 
  for(var j = 0; j < data_row-2; j++){
    html += '<th>'+ j + ' Year </th>'   //this will be the head of first row
  }
  html += '<th> Your Decision(%) </th></tr>'
  for (var i = 0; i < max_row; i++) {
    // add opening <tr> tag to the string:
    html += '<tr>';
    html += '<td><b>Fund '+ (i+1) +'</b></td>'//this will be the first column 
    for (var j = 0; j < data_row; j++) {
      // add <td> elements to the string:
      html += '<td>' + Math.round(data_array[j][i] * 100) / 100 + '%</td>'
    }
    html += '<td><input type="number" id="user_input_array[]" value=""/></td>' //this is a input box
    html += '</tr>'// add closing </tr> tag to the string:
  }
  //append created html to the table body:
  $('#tableBody').append(html)
  // reset the count:
}

/**
 * this function will clear all data and re-generate datas
 * reset everything
 */
function clearTable() {
  data_array = []
  user_input_array = []
  data_row = 3
  cumu_user_array = []
  cumu_market_array = []
  profit_array = []
  market_array = []

  gen_3year_data()
  writeTable()
  cumuUserTable()
  cumuMarketTable()
  writeprofitTable()
  marketProfitTable() 

}

/**
 * This function to get user input value
 * 
 */
function getvalues(){
  user_input_array = $('input[id^="user_input_array[]"]').map(function(){
              return this.value
          }).get()
  if(debug) console.log(user_input_array)
}

/**
 * generate a new row(col in HTML) for data. 
 * and increase data_row by 1.
 * modified
 */
function generateData() {
  var temp = 0
  data_array.push([]);
  for (var j = 0; j < max_row; j++) {
    temp = 0
    temp += normal_random(5, Math.sqrt(200))
    if(j == good_fund){
      temp += normal_random(4, Math.sqrt(200))
    } else {
      temp += normal_random(0, Math.sqrt(200))
    }
    data_array[data_row].push(temp)
  }
  data_row++  
  writeTable()
  if(debug) console.log(data_array)
}

/**
 * calculate user profit
 */
function onefund(pro, input){
  return pro * input / 100
}
function round(value, decimals) {
  return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
}
function getUserprofitforThisYear() {
  getvalues();
  var sum = 0
  var readpro = 0
  var readuserinput = 0
  var totalinput = 0
  var sum_user = 0

  if(data_row >= max_col){
    alert("Sorry, this turn is end...If you still want to play, click on the Start Over button.")
    return
  }
  for(i = 0; i < max_row; i++)
  {
    if(isNaN(Number(user_input_array[i])) == true){
      continue
    }else{
      sum_user +=  Number(user_input_array[i])
    }  
       
  }
  if(sum_user > 100)
  {
    alert("The sum must be less than or equal to 100!")
    writeTable()
    return
  }
  if(sum_user == 0 && leave_it_blank == 0)
  {
    alert("You sure you don't want to put any money into the market?")
    //user_input_array = user_input_array.slice(0,user_input_array.length)
    //market_array = market_array.slice(0,market_array.length)
    //profit_array = profit_array.slice(0,profit_array.length)
    leave_it_blank = 1
    return
  }
  generateData()
  for(var i = 0; i <max_row; i++){
    
    readpro = round(Number(data_array[data_row-1][i]),2)
    if(isNaN(Number(user_input_array[i])) == true){
      readuserinput = 0
      totalinput += readuserinput
    }else{
      readuserinput = Number(user_input_array[i])
      totalinput += readuserinput
    }
    sum += onefund(readpro, readuserinput)
    
  }
   sum = round(sum + 100,2)
  //if(temp_sum == sum)
  //{
   // return
  //}
  //temp_sum = sum
  
  
  profit_array.push(sum)
  writeprofitTable()
  cleantheUserInput()
  marketProfit()
  cumuUserProfit()
  cumuMarketProfit()
  leave_it_blank = 0
  if(data_row == max_col){
    alert("Game ended! Let's check whether you beat the market!")
  }
  beatTheMarket()
}

function writeprofitTable() {
  $('#profitBody').empty()
  // declare html variable (a string holder):
  var html = ''
  html = '<tr><th></th>'

  for(var j = 0; j < data_row-3; j++){
    html += '<th>Year'+(j+1)+'</th>'   //this will be the head of first row
  }
    html += '</tr>'
    html += '<th>User Profit   &nbsp &nbsp;&nbsp    </th>'   //this will be the head of first row

  for (var j = 0; j < data_row-3; j++) {
      // add <td> elements to the string:
    html += '<td>' + profit_array[j] + '</td>'
  }
  
  //append created html to the table body:
  $('#profitBody').append(html)
}

function cleantheUserInput() {
  user_input_array = []
}
function clearbox() {
  $('#tableButtons').val('')
  
}
function marketProfit(){
  var markpro = 0
  for(var i = 0; i <max_row; i++){
    markpro += round(Number(data_array[data_row-1][i]),2)
  }
  markpro = round(markpro/max_row + 100,2) + 1
  market_array.push(markpro)
  marketProfitTable() 
  cumuMarketProfit()
  
}
function marketProfitTable(){
  $('#MarketProfitBody').empty()
  // declare html variable (a string holder):
  var html = '<tr><th></th>';
  for(var j = 0; j < data_row-3; j++){
    html += '<th>Year'+(j+1)+'</th>'   //this will be the head of first row
  }
    html += '</tr>'
    html += '<th>Market Profit </th>'   //this will be the head of first row

  for (var j = 0; j < data_row-3; j++) {
      // add <td> elements to the string:
    html += '<td>' + market_array[j] + '</td>'
  }
  
  //append created html to the table body:
  $('#MarketProfitBody').append(html)

}

function cumuUserProfit(){
  var temp = 0
  cumu_user_array = []
  cumu_user_array.push(profit_array[0])
  for(i=1;i<profit_array.length;i++){
    temp = round(Number(cumu_user_array[i-1]) * Number(profit_array[i]) / 100,2)
    cumu_user_array.push(temp)
  }
  cumuUserTable()
}

function cumuMarketProfit(){
  var temp = 0
  cumu_market_array = []
  cumu_market_array.push(market_array[0])
  for(i=1;i<market_array.length;i++){
    temp = round(Number(cumu_market_array[i-1]) * Number(market_array[i]) / 100,2)
    cumu_market_array.push(temp)
  }
  cumuMarketTable()

}
function cumuUserTable() {
  $('#cumuprofitBody').empty()
  // declare html variable (a string holder):
  var html = '<tr><th></th>';
  for(var j = 0; j < data_row-3; j++){
    html += '<th>Year'+(j+1)+'</th>'   //this will be the head of first row
  }
    html += '</tr>'
    html += '<th>User Cumulative Profit &nbsp;&nbsp;&nbsp </th>'   //this will be the head of first row

  for (var j = 0; j < data_row-3; j++) {
      // add <td> elements to the string:
    html += '<td>' + cumu_user_array[j] + '</td>'
  }
  
  //append created html to the table body:
  $('#cumuprofitBody').append(html)

}
function cumuMarketTable() {
  $('#cumuMarketprofitBody').empty()
  // declare html variable (a string holder):
  var html = '<tr><th></th>';
  for(var j = 0; j < data_row-3; j++){
    html += '<th>Year'+(j+1)+'</th>'   //this will be the head of first row
  }
    html += '</tr>'
    html += '<th>Market Cumulative Profit </th>'   //this will be the head of first row

  for (var j = 0; j < data_row-3; j++) {
      // add <td> elements to the string:
    html += '<td>' + cumu_market_array[j] + '</td>'
  }
  
  //append created html to the table body:
  $('#cumuMarketprofitBody').append(html)

}
function beatTheMarket(){
  if(data_row == max_col){
    if(Number(cumu_user_array[data_row-4]) > Number(cumu_market_array[data_row-4])){
      alert("Congratulations!!You beat the market!!!")
    }else if(Number(cumu_user_array[data_row-4]) < Number(cumu_market_array[data_row-4])){
      alert("Oh...You didn't beat the market...")
    }else{
      alert("You get the same profit as the market!")
    }
    good_fund += 1
    alert("The good fund is: " + good_fund)
  }
}
