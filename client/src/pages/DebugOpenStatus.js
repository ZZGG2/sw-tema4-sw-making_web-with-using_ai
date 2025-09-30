// Parking.js에서 영업중 필터 디버깅용 콘솔 추가
// 검색 결과 리스트 렌더 직전 parkingData의 영업중 판정 결과를 콘솔에 출력
// 실제 데이터와 isParkingOpen 결과를 확인할 수 있음

export default function DebugOpenStatus({ parkingData, isParkingOpen }) {
  if (typeof window !== 'undefined') {
    // 콘솔에 이름, 운영시간, 영업중 여부 출력
    console.log(
      parkingData.map(p => ({
        name: p.name,
        operatingHours: p.operatingHours,
        open: isParkingOpen(p)
      }))
    );
  }
  return null;
}
