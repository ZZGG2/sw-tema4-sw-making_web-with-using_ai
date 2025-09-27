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
  // 검색 버튼 및 Enter 키 이벤트 핸들러
  // 검색 버튼 및 Enter 키 이벤트 핸들러
  const handleSearch = () => {
    fetchParkingData({ ...filters, keyword: searchKeyword });
    setShowList(true);
  };
  // 어떤 카드가 열려있는지 id로 관리
  const [openCardId, setOpenCardId] = useState(null);
  const [showList, setShowList] = useState(false);
  const [parkingData, setParkingData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    city: '',
    type: '',
    available: ''
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchParkingData = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (params.city) queryParams.append('city', params.city);
      if (params.type) queryParams.append('type', params.type);
      if (params.available) queryParams.append('available', params.available);
      
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
      console.error('통계 정보 오류:', err);
    }
  };

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    fetchParkingData(newFilters);
  }

  return (
    <ParkingContainer>
      <PageTitle>강원도 주차장 정보</PageTitle>
      <SearchSection>
        <SearchTitle>주차장 검색 및 필터</SearchTitle>
        <FilterContainer>
          <FilterSelect
            value={filters.city}
            onChange={(e) => handleFilterChange('city', e.target.value)}
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
            onChange={(e) => handleFilterChange('type', e.target.value)}
          >
            <option value="">전체 유형</option>
            <option value="공영">공영</option>
            <option value="민영">민영</option>
          </FilterSelect>
          <FilterSelect
            value={filters.available}
            onChange={(e) => handleFilterChange('available', e.target.value)}
          >
            <option value="">전체</option>
            <option value="true">주차 가능</option>
          </FilterSelect>
        </FilterContainer>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="주차장명 또는 주소를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <SearchButton onClick={handleSearch}>
            <FaSearch />
            검색
          </SearchButton>
        </SearchContainer>
      </SearchSection>
      {/* 지도와 에러 메시지 영역을 검색 결과 아래에 위치 */}
      {error && <ErrorDiv>{error}</ErrorDiv>}
      {/* 검색 후에만 리스트 렌더링 */}
      {showList && parkingData.length > 0 && (
        <ParkingGrid>
          {parkingData.map((parking, idx) => (
            <div key={parking.id || idx}>
              <ParkingCard
                style={{ cursor: 'pointer' }}
                onClick={() => setOpenCardId(openCardId === idx ? null : idx)}
              >
                <ParkingHeader>
                  <ParkingName>{parking.name}</ParkingName>
                  <ParkingType>{parking.type}</ParkingType>
                </ParkingHeader>
                <ParkingAddress>
                  <FaMapMarkerAlt />
                  {parking.address}
                </ParkingAddress>
                <ParkingInfo>
                  <InfoItem>
                    <FaClock />
                    {parking.operatingHours}
                  </InfoItem>
                  <InfoItem>
                    <FaPhone />
                    {parking.phone}
                  </InfoItem>
                  <InfoItem>
                    <FaParking />
                    {parking.fee}
                  </InfoItem>
                  <InfoItem>
                    <FaInfoCircle />
                    {parking.availableSpaces}/{parking.totalSpaces} 공간
                  </InfoItem>
                </ParkingInfo>
                <AvailabilityBar>
                  <AvailabilityFill
                    available={parking.availableSpaces}
                    total={parking.totalSpaces}
                  />
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
      )}

      {stats && (
        <StatsSection>
          <StatCard>
            <StatIcon>
              <FaParking />
            </StatIcon>
            <StatNumber>{stats.totalParkingLots}</StatNumber>
            <StatLabel>총 주차장</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaInfoCircle />
            </StatIcon>
            <StatNumber>{stats.totalSpaces}</StatNumber>
            <StatLabel>총 주차공간</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaFilter />
            </StatIcon>
            <StatNumber>{stats.totalAvailable}</StatNumber>
            <StatLabel>사용 가능</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaClock />
            </StatIcon>
            <StatNumber>{stats.occupancyRate}</StatNumber>
            <StatLabel>점유율</StatLabel>
          </StatCard>
        </StatsSection>
      )}

  </ParkingContainer>
  );
}

export default Parking;
