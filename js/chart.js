const chart_KEY = config.chart_KEY;

fetch(
  `http://apis.data.go.kr/1790387/covid19CurrentStatusConfirmations/covid19CurrentStatusConfirmationsJson?serviceKey=${chart_KEY}`
)
  .then((response) => response.json())
  .then((data) => {
    let dailyInfo = data.response.result[0];

    let date1 = dailyInfo.mmdd1;
    let date2 = dailyInfo.mmdd2;
    let date3 = dailyInfo.mmdd3;
    let date4 = dailyInfo.mmdd4;
    let date5 = dailyInfo.mmdd5;
    let date6 = dailyInfo.mmdd6;
    let date7 = dailyInfo.mmdd7;

    let cnt1 = dailyInfo.cnt1;
    let cnt2 = dailyInfo.cnt2;
    let cnt3 = dailyInfo.cnt3;
    let cnt4 = dailyInfo.cnt4;
    let cnt5 = dailyInfo.cnt5;
    let cnt6 = dailyInfo.cnt6;
    let cnt7 = dailyInfo.cnt7;

    new Chart(document.getElementById("bar-chart"), {
      type: "bar",
      data: {
        labels: [date1, date2, date3, date4, date5, date6, date7],
        datasets: [
          {
            label: "확진자",
            backgroundColor: "#c45850",
            data: [cnt1, cnt2, cnt3, cnt4, cnt5, cnt6, cnt7],
            fontSize: 40,
          },
        ],
      },
      options: {
        legend: {
          display: false,
        },

        // 차트 타이틀
        title: {
          display: true,
          text: "최근 7일 확진 현황",
          fontColor: "rgba(12, 13, 13, 1)",
          fontSize: 25,
        },

        // 차트의 x축, y축
        scales: {
          xAxes: [
            {
              ticks: {
                fontSize: 16,
              },
            },
          ],
          yAxes: [
            {
              ticks: {
                fontSize: 16,
              },
            },
          ],
        },
      },
    });
  })
  .catch((error) => console.log(error));
