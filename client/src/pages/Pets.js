import React, { useState, useEffect } from 'react';
import ParkingMap from '../components/ParkingMap';
import styled from 'styled-components';
import { 
  FaPaw, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPhone,
  FaStar,
  FaHeart,
  FaSearch,
  FaFilter,
  FaHospital,
  FaStore,
  FaTree,
  FaBookOpen
} from 'react-icons/fa';

const PetsContainer = styled.div`
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

const TabContainer = styled.div`
  display: flex;
  gap: 0;
  margin-bottom: 30px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 5px;
  backdrop-filter: blur(10px);
`;

const Tab = styled.button`
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent'};
  color: ${props => props.active ? 'white' : '#666'};
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s ease;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'rgba(102, 126, 234, 0.1)'};
  }
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

const ServicesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const ServiceCard = styled.div`
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

const ServiceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const ServiceIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  
  &.hospital {
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  }
  
  &.shop {
    background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
  }
  
  &.pharmacy {
    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  }
  
  &.park {
    background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
  }
  
  &.shelter {
    background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  }
`;

const ServiceName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

const ServiceType = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const ServiceAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
`;

const ServiceInfo = styled.div`
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

const Services = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const ServiceTag = styled.span`
  background: rgba(102, 126, 234, 0.1);
  color: #667eea;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
`;

const TipCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  backdrop-filter: blur(10px);
  border-left: 4px solid #667eea;
`;

const TipTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
`;

const TipContent = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 10px;
`;

const TipMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 12px;
  color: #999;
`;

const Loading = styled.div`
  text-align: center;
  padding: 40px;
  color: white;
  font-size: 18px;
`;

const Error = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
`;

function Pets() {
  const [activeTab, setActiveTab] = useState('services');
  const [servicesData, setServicesData] = useState([]);
  const [placesData, setPlacesData] = useState([]);
  const [tipsData, setTipsData] = useState([]);
  const [stats, setStats] = useState(null);
  // 동반 장소 지도 토글용
  const [openPlaceIdx, setOpenPlaceIdx] = useState(null);
  // 검색창 UX
  const [showServicesList, setShowServicesList] = useState(false);
  const [showPlacesList, setShowPlacesList] = useState(false);
  const [servicesSearchKeyword, setServicesSearchKeyword] = useState('');
  const [placesSearchKeyword, setPlacesSearchKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [filters, setFilters] = useState({
    type: '',
    city: ''
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  useEffect(() => {
    fetchServicesData();
    fetchTipsData();
    fetchStats();
  }, []);

  const fetchServicesData = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      const queryParams = new URLSearchParams();
      if (params.type) queryParams.append('type', params.type);
      if (params.city) queryParams.append('city', params.city);
      const response = await fetch(`/api/pets/services?${queryParams}`);
      const data = await response.json();
      console.log('servicesData:', data); // 데이터 구조 확인
      if (data.success) {
        setServicesData(data.data);
      } else {
        throw new Error(data.error || '서비스 정보를 가져올 수 없습니다.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlacesData = async (params = {}) => {
    try {
      const queryParams = new URLSearchParams();
      if (params.keyword) queryParams.append('keyword', params.keyword);
      // type, city 등 추가 필터 필요시 여기에
      const response = await fetch(`/api/pets/places?${queryParams}`);
      const data = await response.json();
      console.log('placesData:', data); // 데이터 구조 확인
      if (data.success) {
        setPlacesData(data.data);
      }
    } catch (err) {
      console.error('장소 정보 오류:', err);
    }
  };

  const fetchTipsData = async () => {
    try {
      const response = await fetch('/api/pets/tips');
      const data = await response.json();
      
      if (data.success) {
        setTipsData(data.data);
      }
    } catch (err) {
      console.error('팁 정보 오류:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/pets/stats');
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
    
    if (activeTab === 'services') {
      fetchServicesData(newFilters);
    } else if (activeTab === 'places') {
      fetchPlacesData(newFilters);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFilters({ type: '', city: '' });
    setShowServicesList(false);
    setShowPlacesList(false);
    setServicesSearchKeyword('');
    setPlacesSearchKeyword('');
    setServicesData([]);
    setPlacesData([]);
  };

  const getServiceIcon = (type) => {
    switch (type) {
      case '동물병원': return <FaHospital />;
      case '펫샵': return <FaStore />;
      case '펫파크': return <FaTree />;
      case '동물약국': return <FaHospital />;
      case '보호소': return <FaHeart />;
      default: return <FaPaw />;
    }
  };

  const getServiceIconClass = (type) => {
    switch (type) {
      case '동물병원': return 'hospital';
      case '펫샵': return 'shop';
      case '동물약국': return 'pharmacy';
      case '펫파크': return 'park';
      case '보호소': return 'shelter';
      default: return 'hospital';
    }
  };

  if (loading && !servicesData.length) {
    return (
      <PetsContainer>
        <PageTitle>강원도 반려동물 정보</PageTitle>
        <Loading>반려동물 정보를 불러오는 중...</Loading>
      </PetsContainer>
    );
  }

  return (
    <PetsContainer>
      <PageTitle>강원도 반려동물 정보</PageTitle>
      
      <TabContainer>
        <Tab 
          active={activeTab === 'services'} 
          onClick={() => handleTabChange('services')}
        >
          서비스
        </Tab>
        <Tab 
          active={activeTab === 'places'} 
          onClick={() => handleTabChange('places')}
        >
          동반 장소
        </Tab>
        <Tab 
          active={activeTab === 'tips'} 
          onClick={() => handleTabChange('tips')}
        >
          케어 팁
        </Tab>
      </TabContainer>

      {(activeTab === 'services' || activeTab === 'places') && (
        <SearchSection>
          <SearchTitle>
            {activeTab === 'services' ? '반려동물 서비스' : '반려동물 동반 장소'} 검색
          </SearchTitle>
          
          <FilterContainer>
            <FilterSelect
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">
                {activeTab === 'services' ? '전체 서비스' : '전체 장소'}
              </option>
              {activeTab === 'services' ? (
                <>
                  <option value="동물병원">동물병원</option>
                  <option value="펫샵">펫샵</option>
                  <option value="동물약국">동물약국</option>
                  <option value="펫파크">펫파크</option>
                  <option value="보호소">보호소</option>
                </>
              ) : (
                <>
                  <option value="관광지">관광지</option>
                  <option value="카페거리">카페거리</option>
                  <option value="해변">해변</option>
                </>
              )}
            </FilterSelect>
            
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
          </FilterContainer>
        </SearchSection>
      )}

      {stats && (activeTab === 'services' || activeTab === 'places') && (
        <StatsSection>
          <StatCard>
            <StatIcon>
              <FaHospital />
            </StatIcon>
            <StatNumber>{stats.totalServices}</StatNumber>
            <StatLabel>총 서비스</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaTree />
            </StatIcon>
            <StatNumber>{stats.totalPlaces}</StatNumber>
            <StatLabel>동반 장소</StatLabel>
          </StatCard>
          <StatCard>
            <StatIcon>
              <FaBookOpen />
            </StatIcon>
            <StatNumber>{stats.totalTips}</StatNumber>
            <StatLabel>케어 팁</StatLabel>
          </StatCard>
        </StatsSection>
      )}

      {error && <Error>{error}</Error>}

      {activeTab === 'services' && (
        <div>
          {/* 검색창만 먼저 노출 */}
          <SearchSection>
            <SearchTitle>반려동물 서비스 검색</SearchTitle>
            <FilterContainer>
              <SearchInput
                type="text"
                placeholder="서비스명, 주소, 지역명 등 입력"
                value={servicesSearchKeyword}
                onChange={e => setServicesSearchKeyword(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    fetchServicesData({ keyword: servicesSearchKeyword });
                    setShowServicesList(true);
                  }
                }}
              />
              <SearchButton
                onClick={() => {
                  fetchServicesData({ keyword: servicesSearchKeyword });
                  setShowServicesList(true);
                }}
              >
                <FaSearch /> 검색
              </SearchButton>
            </FilterContainer>
          </SearchSection>
          {/* 검색 후에만 리스트/카드/지도 노출 (카드 클릭 시 지도 토글) */}
          {showServicesList && Array.isArray(servicesData) && servicesData.length > 0 && (
            <ServicesGrid>
              {servicesData.map((service, idx) => (
                <div key={service.id || idx}>
                  <ServiceCard
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpenPlaceIdx(openPlaceIdx === idx ? null : idx)}
                  >
                    <ServiceHeader>
                      <ServiceIcon className={getServiceIconClass(service.type)}>
                        {getServiceIcon(service.type)}
                      </ServiceIcon>
                      <ServiceName>{service.name}</ServiceName>
                      <ServiceType>{service.type}</ServiceType>
                    </ServiceHeader>
                    <ServiceAddress>
                      <FaMapMarkerAlt />
                      {service.address}
                    </ServiceAddress>
                    <ServiceInfo>
                      <InfoItem>
                        <FaClock />
                        {service.operatingHours}
                      </InfoItem>
                      <InfoItem>
                        <FaPhone />
                        {service.phone}
                      </InfoItem>
                    </ServiceInfo>
                  </ServiceCard>
                  {openPlaceIdx === idx && service.lat && service.lon && (
                    <div style={{ margin: '16px 0' }}>
                      <ParkingMap parkingData={[{
                        name: service.name,
                        address: service.address,
                        coordinates: { lat: service.lat, lon: service.lon }
                      }]} />
                    </div>
                  )}
                </div>
              ))}
            </ServicesGrid>
          )}
        </div>
      )}

      {activeTab === 'places' && (
        <div>
          {/* 검색창만 먼저 노출 */}
          <SearchSection>
            <SearchTitle>반려동물 동반 장소 검색</SearchTitle>
            <FilterContainer>
              <SearchInput
                type="text"
                placeholder="장소명, 주소, 지역명 등 입력"
                value={placesSearchKeyword}
                onChange={e => setPlacesSearchKeyword(e.target.value)}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    fetchPlacesData({ keyword: placesSearchKeyword });
                    setShowPlacesList(true);
                  }
                }}
              />
              <SearchButton
                onClick={() => {
                  fetchPlacesData({ keyword: placesSearchKeyword });
                  setShowPlacesList(true);
                }}
              >
                <FaSearch /> 검색
              </SearchButton>
            </FilterContainer>
          </SearchSection>
          {/* 검색 후에만 리스트/카드/지도 노출 (카드 클릭 시 지도 토글) */}
          {showPlacesList && Array.isArray(placesData) && placesData.length > 0 && (
            <ServicesGrid>
              {placesData.map((place, idx) => (
                <div key={place.id || idx}>
                  <ServiceCard
                    style={{ cursor: 'pointer' }}
                    onClick={() => setOpenPlaceIdx(openPlaceIdx === idx ? null : idx)}
                  >
                    <ServiceHeader>
                      <ServiceIcon className="park">
                        <FaTree />
                      </ServiceIcon>
                      <ServiceName>{place.name}</ServiceName>
                      <ServiceType>{place.type}</ServiceType>
                    </ServiceHeader>
                    <ServiceAddress>
                      <FaMapMarkerAlt />
                      {place.address}
                    </ServiceAddress>
                  </ServiceCard>
                  {openPlaceIdx === idx && place.lat && place.lon && (
                    <div style={{ margin: '20px 0' }}>
                      <ParkingMap parkingData={[{
                        name: place.name,
                        address: place.address,
                        coordinates: { lat: place.lat, lon: place.lon }
                      }]} />
                    </div>
                  )}
                </div>
              ))}
            </ServicesGrid>
          )}
        </div>
      )}

      {activeTab === 'tips' && (
        <div>
          {tipsData.map((tip) => (
            <TipCard key={tip.id}>
              <TipTitle>{tip.title}</TipTitle>
              <TipContent>{tip.content}</TipContent>
              <TipMeta>
                <span>{tip.category}</span>
                <span>{tip.date}</span>
              </TipMeta>
            </TipCard>
          ))}
        </div>
      )}
    </PetsContainer>
  );
}

export default Pets;
