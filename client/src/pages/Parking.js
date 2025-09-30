import React, { useState, useEffect } from 'react';
import ParkingMap from '../components/ParkingMap';
import styled from 'styled-components';
import { 
  FaParking, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPhone,
  FaWheelchair,
  FaChargingStation,
  FaSearch,
  FaFilter,
  FaInfoCircle
} from 'react-icons/fa';
import DebugOpenStatus from './DebugOpenStatus';

const ParkingContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
`;

const PageTitle = styled.h1`
  font-size: 36px;
  font-weight: 700;
  color: white;
  text-align: center;
  margin-bottom: 40px;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
`;

const SearchSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
`;

const SearchTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
`;

const FilterContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 20px;
`;

const FilterSelect = styled.select`
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  background: white;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SearchContainer = styled.div`
  display: flex;
  gap: 15px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const SearchInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 16px;
  
  &:focus {
    outline: none;
    border-color: #667eea;
  }
`;

const SearchButton = styled.button`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
  }
`;

const StatsSection = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  backdrop-filter: blur(10px);
`;

const StatIcon = styled.div`
  font-size: 24px;
  color: #667eea;
  margin-bottom: 10px;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: #666;
`;

const ParkingGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const ParkingCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const ParkingHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const ParkingName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

const ParkingType = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const ParkingAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
`;

const ParkingInfo = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 15px;
`;

const InfoItem = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #666;
`;

const AvailabilityBar = styled.div`
  background: #e0e0e0;
  border-radius: 10px;
  height: 20px;
  overflow: hidden;
  margin: 10px 0;
`;

const AvailabilityFill = styled.div`
  height: 100%;
  background: ${props => {
    const ratio = props.available / props.total;
    if (ratio > 0.5) return '#00b894';
    if (ratio > 0.2) return '#fdcb6e';
    return '#e17055';
  }};
  transition: width 0.3s ease;
  width: ${props => (props.available / props.total) * 100}%;
`;

const AvailabilityText = styled.div`
  text-align: center;
  font-size: 12px;
  color: #666;
  margin-top: 5px;
`;

const Amenities = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 15px;
`;

const Amenity = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 12px;
  color: #667eea;
`;

const Loading = styled.div`
  text-align: center;
  padding: 40px;
  color: white;
  font-size: 18px;
`;

const ErrorDiv = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
`;

function Parking() {
  // 주차장 영업중 여부 판단 함수 (운영요일+운영시간)
  function isParkingOpen(parking) {
    if (!parking) return false;
    // 운영요일 필드명: '운영요일' 또는 'operatingDays' 모두 지원
    let daysStr = parking['운영요일'] || parking.operatingDays;
    if (typeof daysStr === 'string') daysStr = daysStr.trim();
    if (!daysStr) {
      // 운영요일 정보가 없으면 영업중으로 간주
      return true;
    }
    // 오늘 요일(0:일~6:토)
    const today = new Date();
    const dayIdx = today.getDay();
    if (daysStr === '평일') {
      return [1,2,3,4,5].includes(dayIdx);
    } else if (daysStr === '평일+토요일') {
      return [1,2,3,4,5,6].includes(dayIdx);
    } else if (daysStr === '평일+공휴일') {
      return [1,2,3,4,5,0].includes(dayIdx);
    } else if (daysStr === '평일+토요일+공휴일') {
      return [1,2,3,4,5,6,0].includes(dayIdx);
    }
    // 위 if/else문에 없는 문자열은 모두 영업중 아님
    console.warn('지원하지 않는 운영요일:', parking.name, daysStr);
    return false;
  }
  // 통계 데이터 상태 선언
  const [stats, setStats] = useState(null);
  // 주차장 데이터 상태 선언
  const [parkingData, setParkingData] = useState([]);
  // 에러 상태 선언
  const [error, setError] = useState(null);
  // 로딩 상태 선언
  const [loading, setLoading] = useState(false);
  // 주차장 리스트 표시 여부 상태 선언
  const [showList, setShowList] = useState(false);
  // 검색어 상태 선언
  const [searchKeyword, setSearchKeyword] = useState('');
  // 필터 상태 선언 (도시, 유형, 영업중)
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    openNow: false
  });

  // 검색 버튼 및 Enter 키 이벤트 핸들러
  const handleSearch = () => {
    fetchParkingData({ ...filters, keyword: searchKeyword });
    setShowList(true);
  };

  // 어떤 카드가 열려있는지 id로 관리
  const [openCardId, setOpenCardId] = useState(null);
  useEffect(() => {
    fetchStats();
    // 검색 전에는 리스트를 표시하지 않음
  }, []);

  const fetchParkingData = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      if (params.city) queryParams.append('city', params.city);
      if (params.type) queryParams.append('type', params.type);
      if (params.keyword) queryParams.append('keyword', params.keyword);
  // available(영업중) 파라미터는 프론트엔드에서만 필터링하므로 서버로 전달하지 않음
      const response = await fetch(`/api/parking?${queryParams}`);
      const data = await response.json();
      if (data.success) {
        setParkingData(data.data);
      } else {
        throw new Error(data.error || '주차장 정보를 가져올 수 없습니다.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/parking/stats/summary');
      const data = await response.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParkingContainer>
      <PageTitle>강원도 공영주차장 정보</PageTitle>
      <SearchSection>
        <SearchTitle>주차장 검색 및 필터</SearchTitle>
        <FilterContainer>
          <FilterSelect
            value={filters.city}
            onChange={e => setFilters(f => ({ ...f, city: e.target.value }))}
          >
            <option value="">전체 도시</option>
            <option value="춘천">춘천</option>
            <option value="강릉">강릉</option>
            <option value="원주">원주</option>
            <option value="속초">속초</option>
            <option value="동해">동해</option>
          </FilterSelect>
          <FilterSelect
            value={filters.type}
            onChange={e => setFilters(f => ({ ...f, type: e.target.value }))}
          >
            <option value="">전체 유형</option>
            <option value="노외">노외</option>
            <option value="노상">노상</option>
          </FilterSelect>
          {/* 영업중 필터 체크박스 */}
          <label style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <input
              type="checkbox"
              checked={filters.openNow}
              onChange={e => setFilters(f => ({ ...f, openNow: e.target.checked }))}
            />
            영업중
          </label>
        </FilterContainer>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="주차장명, 주소, 지역명 등 입력"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            onKeyPress={e => { if (e.key === 'Enter') handleSearch(); }}
          />
          <SearchButton onClick={handleSearch}>
            <FaSearch /> 검색
          </SearchButton>
        </SearchContainer>
      </SearchSection>
      {showList && (
        <>
          <DebugOpenStatus parkingData={parkingData} isParkingOpen={isParkingOpen} />
          {parkingData.length > 0 ? (
            <ParkingGrid>
              {parkingData
                .filter(parking => !filters.openNow || isParkingOpen(parking))
                .map((parking, idx) => (
                  <div key={parking.id || idx}>
                    <ParkingCard onClick={() => setOpenCardId(openCardId === idx ? null : idx)}>
                      <ParkingHeader>
                        <FaParking style={{ fontSize: 22, color: '#667eea' }} />
                        <ParkingName>{parking.name}</ParkingName>
                        <ParkingType>{parking.type}</ParkingType>
                        {/* 영업중 뱃지 */}
                        {isParkingOpen(parking) && (
                          <span style={{ background: '#00b894', color: 'white', borderRadius: 6, padding: '2px 10px', fontSize: 13, fontWeight: 600, marginLeft: 8 }}>
                            영업중
                          </span>
                        )}
                      </ParkingHeader>
                      <ParkingAddress>
                        <FaMapMarkerAlt />
                        {parking.address}
                      </ParkingAddress>
                      <ParkingInfo>
                        <InfoItem>
                          <FaPhone />
                          {parking.phone}
                        </InfoItem>
                        <InfoItem>
                          <FaClock />
                          {parking.operatingHours}
                        </InfoItem>
                      </ParkingInfo>
                      <AvailabilityBar total={parking.totalSpaces} available={parking.availableSpaces}>
                        <AvailabilityFill total={parking.totalSpaces} available={parking.availableSpaces} />
                      </AvailabilityBar>
                      <AvailabilityText>
                        {parking.availableSpaces}개 공간 사용 가능
                      </AvailabilityText>
                      <Amenities>
                        {(parking.amenities || []).map((amenity, index) => (
                          <Amenity key={index}>
                            {amenity.includes('장애인') ? <FaWheelchair /> : null}
                            {amenity.includes('전기차') ? <FaChargingStation /> : null}
                            {amenity}
                          </Amenity>
                        ))}
                      </Amenities>
                    </ParkingCard>
                    {/* 카드가 열려있을 때만 지도 표시 */}
                    {openCardId === idx && (
                      <div style={{ margin: '20px 0' }}>
                        <ParkingMap parkingData={[parking]} />
                      </div>
                    )}
                  </div>
                ))}
            </ParkingGrid>
          ) : (
            <div style={{ textAlign: 'center', color: '#666', margin: '40px 0' }}>
              검색 결과가 없습니다.
            </div>
          )
        }
        </>
      )}
    </ParkingContainer>
  );
}

export default Parking;
