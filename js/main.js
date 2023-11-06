const covid_KEY = config.covid_KEY;

// 전체 확진 현황
// https://api.corona-19.kr
// https://github.com/dhlife09/Corona-19-API?utm_source=keygen-email
fetch(`https://api.corona-19.kr/korea/?serviceKey=${covid_KEY}`, {
  headers: { Accept: 'application/json' },
})
  .then((response) => response.json())
  .then((data) => {
    const updateTime = data.API.updateTime.slice(14, -1); // 전체 현황 업데이트시간
    const TotalCase = data.korea.totalCnt; // 전체 확진자수
    const TotalDeath = data.korea.deathCnt; // 전체 사망자수

    document.querySelector('.total_update_time').innerText =
      updateTime !== undefined ? `전체 현황 : ${updateTime}` : `loading⋯`;
    document.querySelector('.total_case').innerText =
      TotalCase !== undefined ? `${TotalCase}` : `loading⋯`;
    document.querySelector('.total_death').innerText =
      TotalDeath !== undefined ? `${TotalDeath}` : `loading⋯`;
  })
  .catch((error) => alert(error));

// 예방접종 현황
// https://api.corona-19.kr
// https://github.com/dhlife09/Corona-19-API?utm_source=keygen-email
fetch(`https://api.corona-19.kr/korea/vaccine/?serviceKey=${covid_KEY}`, {
  headers: { Accept: 'application/json' },
})
  .then((response) => response.json())
  .then((data) => {
    const vacList = [
      data.korea.vaccine_1.vaccine_1, //1차 접종 완료자
      data.korea.vaccine_2.vaccine_2, //2차 접종 완료자
    ];

    const vac = document.querySelectorAll('.vac');

    vac.forEach((item, idx) => {
      vacList[idx] = vacList[idx].toLocaleString();
      item.innerHTML = `<span>${idx + 1}차 접종 완료자</span> <br> ${
        vacList[idx]
      }명`;
    });
  })
  .catch((error) => console.log(error));

// 일일 확진 현황 (공공데이터)
// 질병관리청_코로나19 국내발생현황 조회
// https://www.data.go.kr/index.do
const covid_today_KEY = config.covid_today_KEY;

fetch(
  `http://apis.data.go.kr/1790387/covid19CurrentStatusKorea/covid19CurrentStatusKoreaJason?serviceKey=${covid_today_KEY}&pageNo=1&numOfRows=10&startCreateDt=20220101&end20221116`,
  { headers: { Accept: 'application/json' } }
)
  .then((response) => response.json())
  .then((data) => {
    let TodayInfo = data['response']['result'][0];
    document.querySelector('.today_update_time').innerText =
      TodayInfo.mmddhh !== undefined
        ? `일일 현황 : ${TodayInfo.mmddhh} 기준`
        : `loading⋯`;

    document.querySelector('.today_case').innerText =
      TodayInfo.cnt_confirmations !== undefined
        ? `+ ${TodayInfo.cnt_confirmations}`
        : `loading⋯`;

    document.querySelector('.today_death').innerText =
      TodayInfo.cnt_deaths !== undefined
        ? `+ ${TodayInfo.cnt_deaths}`
        : `loading⋯`;

    document.querySelector('.today_hospital').innerText =
      TodayInfo.cnt_hospitalizations !== undefined
        ? ` + ${TodayInfo.cnt_hospitalizations}`
        : `loading⋯`;
  })
  .catch((error) => console.log(error));

// 팝업으로 지도 띄우기
function popup() {
  window.open('map.html', 'map_popup', 'width=700, height=600');
}
