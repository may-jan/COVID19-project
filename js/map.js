let hospitalList = [];
let nowPositionLat;
let nowPositionLng;

// 현재 위치 구해서 로딩시 현재위치 나타내기
navigator.geolocation.getCurrentPosition(success, error);

function success(e) {
  const nowLat = e.coords.latitude;
  const nowLng = e.coords.longitude;
  nowPositionLat = nowLat;
  nowPositionLng = nowLng;
}

function error() {
  alert('위치 정보를 불러올 수 없습니다');
}

// 중앙•권역, 지역별 코로나19 예방접종센터 위치정보 (공공데이터)
const map_KEY = config.map_KEY;
fetch(
  `https://api.odcloud.kr/api/15077586/v1/centers?page=1&perPage=284&serviceKey=${map_KEY}`,
  { headers: { Accept: 'application/json' } }
)
  .then((response) => response.json())
  .then((data) => {
    const hosInfo = data['data'];

    // 병원 정보
    hosInfo.forEach((item) => {
      const lat = item.lat;
      const lng = item.lng;
      const address = item.address;
      const centerName = item.centerName;
      const phoneNumber = item.phoneNumber;

      // 병원 정보 객체 생성
      hospitalInfo = {
        lat: lat,
        lng: lng,
        address: address,
        centerName: centerName,
        phoneNumber: phoneNumber,
      };

      // 병원 정보를 hospitalList 배열에 추가
      hospitalList.push(hospitalInfo);
    });

    // 위치 정보 저장할 positions 배열
    let positions = [];

    // 위치 정보 저장
    hospitalList.forEach((info) => {
      positions.push({
        latlng: new kakao.maps.LatLng(info.lat, info.lng),
        address: info.address,
        number: info.phoneNumber,
        name: info.centerName,
      });
    });

    // 지도를 출력하는 함수 호출
    showMap(positions);
  })
  .catch((error) => console.log(error));

// 지도 출력 함수 showMap
function showMap(positions) {
  // 마커에 마우스 이벤트 등록하기
  // https://apis.map.kakao.com/web/sample/addMarkerMouseEvent/
  let mapContainer = document.getElementById('map');

  let mapOption = {
    // 지도의 중심좌표
    center: new kakao.maps.LatLng(nowPositionLat, nowPositionLng),
    // 지도의 확대 레벨
    level: 3,
    // 마커표시
    marker: positions,
  };

  let map = new kakao.maps.Map(mapContainer, mapOption);

  // 다른 이미지로 마커 생성하기
  // https://apis.map.kakao.com/web/sample/basicMarkerImage/
  positions.forEach((item) => {
    let imageSrc =
      'https://www.shareicon.net/data/512x512/2016/04/03/744127_hospital_512x512.png';
    let imageSize = new kakao.maps.Size(45, 45);
    let markerImage = new kakao.maps.MarkerImage(imageSrc, imageSize);

    // 마커 생성
    let marker = new kakao.maps.Marker({
      map: map,
      position: item.latlng,
      title: item.title,
      image: markerImage,
    });

    // 마커에 mouseover 이벤트 적용해서 정보 표시하기
    // 문자열에서 '코로나19' 잘라내기
    let centerName = item.name.slice(5);

    // 인포윈도우 생성하기
    // https://apis.map.kakao.com/web/sample/basicInfoWindow/
    // 마커에 mouseover 했을 때 표시할 인포윈도우 생성
    let iwContent = `
        <div class="window_wrap">
            <div class="window_name">${centerName}</div>
            <div class="window_address">${item.address}</div>
            <div class="window_number">☎️ ${item.number}</div>
        </div>
        `;
    let infowindow = new kakao.maps.InfoWindow({
      content: iwContent,
    });

    // mouseover 이벤트
    kakao.maps.event.addListener(marker, 'mouseover', function () {
      infowindow.open(map, marker);
    });

    // mouseout 이벤트
    kakao.maps.event.addListener(marker, 'mouseout', function () {
      infowindow.close();
    });

    marker.setMap(map);
  });

  // 지도 컨트롤 추가
  let mapTypeControl = new kakao.maps.MapTypeControl();

  // 컨트롤 위치 정의
  map.addControl(mapTypeControl, kakao.maps.ControlPosition.TOPRIGHT);

  // 확대 축소를 제어하는 줌 컨트롤
  let zoomControl = new kakao.maps.ZoomControl();
  map.addControl(zoomControl, kakao.maps.ControlPosition.RIGHT);
}
