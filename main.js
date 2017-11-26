//import jstat from http://jstat.github.io/
var debug = true

var max_Fund = 25 //change variable name for clean code
var max_Year = 15 //change variable name for clean code
var data_array = []
var user_input_array = []
var data_row = 3
var good_fund = Math.floor(max_Fund * Math.random())//generate the good fund randomly
var lastThreeGain = [] 
var maxLast3GainFund = [] 
var halfandhalf = 100

var profit_array = []
var temp_sum = 0
var market_array = []
var leave_it_blank = 0
var cumu_user_array = []
var cumu_market_array = []
var cumu_funds_array = []


// For test purpose
// tempAry = []
// sum = 0
// count = 0
// tempSize=10
// for (i = 0; i < tempSize; i++) {
//   tempAry.push(jStat.normal.sample(0, 5))
//   sum += tempAry[i]
//   if (tempAry[i] >= 13 && tempAry[i] <= 15) count++
// }
// console.log(jStat.normal.mean(0, 5))
// console.log(tempAry)
// console.log(sum / tempSize)
// console.log(count)
// m = sum / tempSize
// s= 0
// for (i = 0; i < tempSize; i++) {
//   s += Math.pow(tempAry[i]-m,2)
// }
// s /= tempSize
// s=Math.sqrt(s)
// console.log(s)


// a row of data is data_array[years][fund]. fund is between 0~24
// so, 3 year display data will be store in data_array[0~2][0~24]
// next new data will be data_array[3], and next will be data_array[4]

// everytime user input will be read in user_input_array[i]. i is between 0~24. data will NOT be clear unless user clear the input boxs.

/**
 * for include javascript library using
 * 
 * @param {any} incFile 
 */
function includeJS(incFile)
{
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
function normal_random(mean, stdev) 
{
  // if (mean == undefined) mean = 0.0
  // if (stdev == undefined) stdev = 1.0
  // do 
  // {
  //   U1 = Math.random()
  //   U2 = Math.random()
  //   V1 = 2 * U1 - 1
  //   V2 = 2 * U2 - 1
  //   S = V1 * V1 + V2 * V2
  // } while (S > 1)

  // X = Math.sqrt(-2 * Math.log(S) / S) * V1
  // //Y = Math.sqrt(-2 * Math.log(S) / S) * V2
  // X = mean + Math.sqrt(stdev) * X
  // //Y = mean + Math.sqrt(variance) * Y 
  // return X
  return jStat.normal.sample(mean, stdev)
}

/**
 * This function will generate 3 years random datas.
 * modified
 */
function genThreeYearData() //change function name for clean code
{
  for (year = 0; year < data_row; year++) 
  {
    data_array.push([]);
    market = normal_random(5, Math.sqrt(200))
    for (fund = 0; fund < max_Fund; fund++) 
    {
      newRate = market
      if (fund == good_fund) newRate += normal_random(2, Math.sqrt(200))
      else newRate += normal_random(0, Math.sqrt(200))
      data_array[year].push(newRate)
    }
  }
}

/**
 * calculuate last three year gain and put it into lastThreeGain
 * 
 * @param {any} data_array 
 * @returns 
 */
function calLastThreeGain(data_array)
{
  lastThreeGain = []
  for (fund = 0; fund < data_array[0].length; fund++) 
  {
    gain = 1
    for (years = data_array.length - 3; years < data_array.length; years++)
    {
      gain *= (data_array[years][fund]/100 + 1)
    }
    gain = gain - 1
    lastThreeGain.push(gain)
  }
  if (debug) console.log(lastThreeGain)
  return lastThreeGain
}

/**
 * this function will write data_array to HTML with input box on let
 * 
 * DO NOT coufuse row and col in html display, that is because we use 2D array but want to display each row in array to HTML in col
 */
function writeTable() 
{
  method1()

  // declare html variable (a string holder):
  var html = '<tr><th></th>';
  html += '<th>' + 2 + ' Years ago</th>'
  html += '<th>' + 1 + ' Year ago</th>'
  for (var year = 0; year < data_row - 2; year++)
  {
    html += '<th>' + year + ' Year </th>'   //this will be the head of first row
  }
  if (data_row > 3) html += '<th> Current</br>Allocation(%)</th><th> Funds</br>value </th>'
  html += '<th>Last 3 years</br>gain </th><th> New</br>Allocation(%)</th></tr>'
  for (var fund = 0; fund < max_Fund; fund++) 
  {
    // add opening <tr> tag to the string:
    html += '<tr>';
    html += '<td><b>Fund ' + (fund + 1) + '</b></td>'//this will be the first column 
    for (var year = 0; year < data_row; year++) 
    {
      // add <td> elements to the string:
      html += '<td>' + Math.round(data_array[year][fund] * 100) / 100 + '%</td>'
    }
    if (data_row > 3)
    {
      if (user_input_array[fund] === undefined) html += ''
      else html += '<td>' + user_input_array[fund] + '</td>'
      html += '<td>' + cumu_funds_array[data_row][fund] + '</td>'
    }
    html += '<td>' + Math.round(lastThreeGain[fund] * 10000) / 100 + '%</td>'

    html += '<td>'

    //input box 
    html += '<input style="width: 90px;"type="number" id="user_input_array[]" value="'

    // if (fund == maxLast3GainFund[0]) html += '50'
    // else if (fund == maxLast3GainFund[1]) html += '30'
    // else if (fund == maxLast3GainFund[2]) html += '20'
    // else 
    html += '""'

    html += '"/>' //this is a input box
    //end of input box
    html += '</td>'

    html += '</tr>'// add closing </tr> tag to the string:
  }

  //empty and append created html to the table body:
  $('#tableBody').empty()
  $('#tableBody').append(html)
}

/**b
 * this function will clear all data and re-generate datas
 * reset everything
 */
function clearTable() 
{
  data_array = []
  user_input_array = []
  data_row = 3
  cumu_user_array = []
  cumu_market_array = []
  profit_array = []
  market_array = []
  cumu_funds_array = []

  genThreeYearData()
  writeTable()
  cumuUserTable()
  cumuMarketTable()
  writeprofitTable()
  marketProfitTable()
  $('#goodFund').empty()

}

/**
 * This function to get user input value
 * 
 */
function getValues() //change function name for clean code
{
  user_input_array = $('input[id^="user_input_array[]"]').map(function ()
  {
    return this.value
  }).get()
  if (debug) console.log(user_input_array)
}

/**
 * pass an (funds)data_array and then calcluate the year profit average, return for funds
 * 
 * @param {any} data_array 
 * @returns avgArray
 */
function calFundAvg(data_array) //change function name for clean code
{
  avgArray = []
  for (fund = 0; fund < data_array[0].length; fund++) 
  {
    avg = 0
    for (year = 0; year < data_array.length; year++) 
    {
      avg += data_array[year][fund]
    }
    avgArray.push(avg / data_array.length)
  }
  return avgArray
}


/**
 * find top 3 fund for overall average and last 3 years ovrall averger
 * 
 */
function method1() 
{

  avgArray = calFundAvg(data_array)

  if(debug) console.log(avgArray)
  lastThreeGain = calLastThreeGain(data_array) //put it to global
  //maxLast3GainFund = last //global list(array) 
  maxAvgFund = []

  for (i = 0; i < 3; i++)
  {
    max = -1000
    maxAvg = -1000
    for (fund = 0; fund < max_Fund; fund++)
    {
      if (avgArray[fund] > max && maxAvgFund.indexOf(fund) == -1)
      {
        maxAvgFund[i] = fund;
        max = avgArray[fund]
      }

      if (lastThreeGain[fund] > maxAvg && maxLast3GainFund.indexOf(fund) == -1)
      {
        maxLast3GainFund[i] = fund;
        maxAvg = lastThreeGain[fund]
      }
    }
  }

  if (debug) console.log(maxAvgFund, maxLast3GainFund)

  html = '<tr> \
            <th>Rank</th> \
            <th>Since inception</th> \
            <th>Last 3 years </th> \
          </tr>'

  for (i = 0; i < maxAvgFund.length; i++)
  {
    html += '<tr>'
    html += '<td>' + (i + 1) + '</td>' +
      '<td>' + "Fund " + (maxAvgFund[i] + 1) + '</td>' +
      '<td>' + "Fund " + (maxLast3GainFund[i] + 1) + '</td>'
    html += '</tr>'
  }
  $('#method1').empty()
  $('#method1').append(html)
}

/**
 * generate a new row(col in HTML) for data. 
 * and increase data_row by 1.
 * modified
 */
function generateData() 
{
  var temp = 0
  var market = 0

  data_array.push([])
  market = normal_random(5, Math.sqrt(200))
  market_array.push(round(market + 101, 2))

  for (var j = 0; j < max_Fund; j++) 
  {
    temp = market
    if (j == good_fund) temp += normal_random(2, Math.sqrt(200))
    else temp += normal_random(0, Math.sqrt(200))
    data_array[data_row].push(temp)
  }
  data_row++
  cumuFunds()
  writeTable()
  if (debug) console.log(data_array)
}

/*******************************************************************************************************************/

/**
 * calculate user profit
 */
function onefund(pro, input)
{
  return pro * input / 100
}
function round(value, decimals)
{
  return Number(Math.round(value + 'e' + decimals) + 'e-' + decimals);
}

function getUserprofitforThisYear()
{
  getValues()
  var sum = 0
  var readpro = 0
  var readuserinput = 0
  var totalinput = 0
  var sum_user = 0

  if (data_row >= max_Year)
  {
    alert("Sorry, this turn is end...If you still want to play, click on the Start Over button.")
    return
  }
  for (i = 0; i < max_Fund; i++)
  {
    if (isNaN(Number(user_input_array[i])) == true)
    {
      continue
    } else
    {
      sum_user += Number(user_input_array[i])
    }

  }
  if (sum_user > 100)
  {
    alert("The sum must be less than or equal to 100!")
    //writeTable()
    return
  }
  if (sum_user == 0 && leave_it_blank == 0)
  {
    alert("You sure you don't want to put any money into the market?")
    //user_input_array = user_input_array.slice(0,user_input_array.length)
    //market_array = market_array.slice(0,market_array.length)
    //profit_array = profit_array.slice(0,profit_array.length)
    leave_it_blank = 1
    return
  }
  generateData()
  for (var i = 0; i < max_Fund; i++)
  {

    readpro = round(Number(data_array[data_row - 1][i]), 2)
    if (isNaN(Number(user_input_array[i])) == true)
    {
      readuserinput = 0
      totalinput += readuserinput
    } else
    {
      readuserinput = Number(user_input_array[i])
      totalinput += readuserinput
    }
    sum += onefund(readpro, readuserinput)

  }
  sum = round(sum + 100, 2)
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
  if (data_row == max_Year)
  {
    alert("Game ended! Let's check whether you beat the market!")
  }
  beatTheMarket()
}


function writeprofitTable()
{
  $('#profitBody').empty()
  // declare html variable (a string holder):
  var html = ''
  html = '<tr><th></th>'

  for (var j = 0; j < data_row - 3; j++)
  {
    html += '<th>Year' + (j + 1) + '&nbsp;</th>'   //this will be the head of first row
  }
  html += '</tr>'
  html += '<th>Your gain &nbsp;</th>'   //this will be the head of first row

  for (var j = 0; j < data_row - 3; j++)
  {
    // add <td> elements to the string:
    html += '<td>' + round(profit_array[j] - 100, 2) + '%</td>'
  }

  //append created html to the table body:
  $('#profitBody').append(html)
}

function cleantheUserInput()
{
  user_input_array = []
}
function clearbox()
{
  $('#tableButtons').val('')
}
function marketProfit()
{
  //var markpro = 0
  //for(var i = 0; i <max_Fund; i++){
  //  markpro += round(Number(data_array[data_row-1][i]),2)
  //}
  //markpro = round(markpro/max_Fund + 100,2) + 1
  //market_array.push(markpro)
  marketProfitTable()
  cumuMarketProfit()

}
function marketProfitTable()
{
  //$('#MarketProfitBody').empty()
  // declare html variable (a string holder):
  var html = '';
  //for(var j = 0; j < data_row-3; j++){
  //html += '<th>Year'+(j+1)+'&nbsp;</th>'   //this will be the head of first row
  //}
  //html += '</tr>'
  html += '<th>Index gain</th>'   //this will be the head of first row

  for (var j = 0; j < data_row - 3; j++)
  {
    // add <td> elements to the string:
    html += '<td>' + round(market_array[j] - 100, 2) + '&nbsp;%</td>'
  }

  //append created html to the table body:
  $('#profitBody').append(html)

}

function cumuUserProfit()
{
  var temp = 0
  cumu_user_array = []
  cumu_user_array.push(profit_array[0])
  for (i = 1; i < profit_array.length; i++)
  {
    temp = round(Number(cumu_user_array[i - 1]) * Number(profit_array[i]) / 100, 2)
    cumu_user_array.push(temp)
  }
  cumuUserTable()
}

function cumuMarketProfit()
{
  var temp = 0
  cumu_market_array = []
  cumu_market_array.push(market_array[0])
  for (i = 1; i < market_array.length; i++)
  {
    temp = round(Number(cumu_market_array[i - 1]) * Number(market_array[i]) / 100, 2)
    cumu_market_array.push(temp)
  }
  cumuMarketTable()

}
function cumuUserTable()
{
  $('#cumuprofitBody').empty()
  // declare html variable (a string holder):
  var html = '<tr><th></th>';
  for (var j = 0; j < data_row - 3; j++)
  {
    html += '<th>' + (j + 1) + ' Years' + '&nbsp;</th>'   //this will be the head of first row
  }
  html += '</tr>'
  html += '<th>Your Portfolio Value  </th>'   //this will be the head of first row

  for (var j = 0; j < data_row - 3; j++)
  {
    // add <td> elements to the string:
    html += '<td>' + cumu_user_array[j] + '</td>'
  }

  //append created html to the table body:
  $('#cumuprofitBody').append(html)

}
function cumuMarketTable()
{
  //$('#cumuMarketprofitBody').empty()
  // declare html variable (a string holder):
  var html = '';
  //for(var j = 0; j < data_row-3; j++){
  //html += '<th>Year'+(j+1)+'&nbsp;</th>'   //this will be the head of first row
  //}
  html +=
    html += '<th>Index Value &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp </th>'   //this will be the head of first row

  for (var j = 0; j < data_row - 3; j++)
  {
    // add <td> elements to the string:
    html += '<td>' + cumu_market_array[j] + '</td>'
  }

  //append created html to the table body:
  $('#cumuprofitBody').append(html)

}
function cumuFunds()
{
  var temp = 0
  cumu_funds_array = []
  cumu_funds_array.push([])
  for (k = 0; k < max_Fund; k++)
  {
    cumu_funds_array[0].push(100)
  }
  for (i = 0; i < data_row; i++)
  {
    for (j = 0; j < max_Fund; j++)
    {
      cumu_funds_array.push([])
      temp = round(Number(cumu_funds_array[i][j]) * Number(100 + data_array[i][j]) / 100, 2)
      cumu_funds_array[i + 1].push(temp)
    }
  }

}
function beatTheMarket()
{
  if (data_row == max_Year)
  {
    if (Number(cumu_user_array[data_row - 4]) > Number(cumu_market_array[data_row - 4]))
    {
      alert("Congratulations!!You beat the market!!!")
    } else if (Number(cumu_user_array[data_row - 4]) < Number(cumu_market_array[data_row - 4]))
    {
      alert("Oh...You didn't beat the market...")
    } else
    {
      alert("You get the same profit as the market!")
    }
    good_fund += 1
    alert("The good fund will be shown on the page")
    $('#goodFund').append("</br><b>The worthwhile fund is " + good_fund + ".</b>")
  }
}