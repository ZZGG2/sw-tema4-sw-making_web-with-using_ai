import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { 
  FaStore, 
  FaMapMarkerAlt, 
  FaClock, 
  FaPhone,
  FaStar,
  FaHeart,
  FaSearch,
  FaFilter,
  FaCheckCircle,
  FaUsers,
  FaBuilding,
  FaHandsHelping,
  FaCrown
} from 'react-icons/fa';

const BusinessesContainer = styled.div`
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

const BusinessesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
`;

const BusinessCard = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  backdrop-filter: blur(10px);
  transition: all 0.2s ease;
  border-left: 4px solid ${props => props.$verified ? '#00b894' : '#e0e0e0'};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  }
`;

const BusinessHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
`;

const BusinessIcon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  
  &.public {
    background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  }
  
  &.medical {
    background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
  }
  
  &.welfare {
    background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
  }
  
  &.education {
    background: linear-gradient(135deg, #fdcb6e 0%, #e17055 100%);
  }
  
  &.social {
    background: linear-gradient(135deg, #6c5ce7 0%, #a29bfe 100%);
  }
`;

const BusinessName = styled.h3`
  font-size: 18px;
  font-weight: 600;
  color: #333;
  flex: 1;
`;

const BusinessCategory = styled.span`
  background: #667eea;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const VerifiedBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  background: #00b894;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
`;

const BusinessAddress = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #666;
  font-size: 14px;
  margin-bottom: 15px;
`;

const BusinessInfo = styled.div`
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

const BusinessDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 15px;
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

const GoodDeeds = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 15px;
`;

const GoodDeedTag = styled.span`
  background: rgba(0, 184, 148, 0.1);
  color: #00b894;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Rating = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
`;

const TopRatedSection = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 30px;
  margin-bottom: 30px;
  backdrop-filter: blur(10px);
`;

const SectionTitle = styled.h2`
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #333;
  display: flex;
  align-items: center;
  gap: 10px;
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

function Businesses() {
  const [businessesData, setBusinessesData] = useState([]);
  const [topRatedData, setTopRatedData] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showList, setShowList] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    city: '',
    verified: ''
  });
  const [searchKeyword, setSearchKeyword] = useState('');

  // useEffect(() => {
  //   fetchBusinessesData();
  //   fetchTopRatedData();
  //   fetchStats();
  // }, []);

  const fetchBusinessesData = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const queryParams = new URLSearchParams();
      if (params.category) queryParams.append('category', params.category);
      if (params.city) queryParams.append('city', params.city);
      if (params.verified) queryParams.append('verified', params.verified);
      
      const response = await fetch(`/api/businesses?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setBusinessesData(data.data);
      } else {
        throw new Error(data.error || '착한업소 정보를 가져올 수 없습니다.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTopRatedData = async () => {
    try {
      const response = await fetch('/api/businesses/popular/top-rated?limit=3');
      const data = await response.json();
      
      if (data.success) {
        setTopRatedData(data.data);
      }
    } catch (err) {
      console.error('인기 업소 오류:', err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/businesses/stats/summary');
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
    // 필터만 바꿔도 바로 fetch하지 않고, 검색 버튼/엔터로만 리스트 노출
    setShowList(false);
    setBusinessesData([]);
  };

  const handleSearch = async () => {
    setLoading(true);
    setShowList(false);
    try {
      let data;
      if (searchKeyword.trim()) {
        // 검색어가 있으면 키워드+필터로 검색
        const response = await fetch(`/api/businesses/search/${encodeURIComponent(searchKeyword)}`);
        data = await response.json();
      } else {
        // 검색어 없으면 필터만으로 fetch
        const queryParams = new URLSearchParams();
        if (filters.category) queryParams.append('category', filters.category);
        if (filters.city) queryParams.append('city', filters.city);
        if (filters.verified) queryParams.append('verified', filters.verified);
        const response = await fetch(`/api/businesses?${queryParams}`);
        data = await response.json();
      }
      if (data.success) {
        setBusinessesData(data.data);
        setShowList(true);
      } else {
        throw new Error(data.error || '검색 결과를 찾을 수 없습니다.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getBusinessIcon = (category) => {
    switch (category) {
      case '공공기관': return <FaBuilding />;
      case '의료기관': return <FaHandsHelping />;
      case '복지기관': return <FaHeart />;
      case '교육기관': return <FaUsers />;
      case '사회적기업': return <FaStore />;
      default: return <FaStore />;
    }
  };

  const getBusinessIconClass = (category) => {
    switch (category) {
      case '공공기관': return 'public';
      case '의료기관': return 'medical';
      case '복지기관': return 'welfare';
      case '교육기관': return 'education';
      case '사회적기업': return 'social';
      default: return 'public';
    }
  };

  // 검색 전에는 검색창만, 검색 시에만 리스트 노출

  return (
    <BusinessesContainer>
      <PageTitle>강원도 착한업소</PageTitle>
      <SearchSection>
        <SearchTitle>착한업소 검색 및 필터</SearchTitle>
        <FilterContainer>
          <FilterSelect
            value={filters.category}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">전체 카테고리</option>
            <option value="공공기관">공공기관</option>
            <option value="의료기관">의료기관</option>
            <option value="복지기관">복지기관</option>
            <option value="교육기관">교육기관</option>
            <option value="사회적기업">사회적기업</option>
            <option value="협동조합">협동조합</option>
            <option value="자원봉사단체">자원봉사단체</option>
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
            <option value="태백">태백</option>
          </FilterSelect>
          <FilterSelect
            value={filters.verified}
            onChange={(e) => handleFilterChange('verified', e.target.value)}
          >
            <option value="">전체</option>
            <option value="true">인증업소만</option>
          </FilterSelect>
        </FilterContainer>
        <SearchContainer>
          <SearchInput
            type="text"
            placeholder="업소명, 주소, 서비스를 입력하세요"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
          />
          <SearchButton
            onClick={handleSearch}
          >
            <FaSearch />
            검색
          </SearchButton>
        </SearchContainer>
      </SearchSection>
      {/* 검색 시에만 리스트/카드/네이버 지도 노출 */}
      {showList && (
        <BusinessesGrid>
          {businessesData.map((business) => (
            <BusinessCard key={business.id}>
              <BusinessHeader>
                <BusinessIcon>
                  <FaStore />
                </BusinessIcon>
                <BusinessName>{business.name}</BusinessName>
                <BusinessCategory>{business.category}</BusinessCategory>
              </BusinessHeader>
              <BusinessAddress>
                <FaMapMarkerAlt />
                {business.address}
              </BusinessAddress>
              <BusinessInfo>
                <InfoItem>
                  <FaPhone />
                  {business.phone}
                </InfoItem>
              </BusinessInfo>
              <div style={{ marginTop: '12px', textAlign: 'right' }}>
                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(business.address)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #03c75a 0%, #00b894 100%)',
                    color: 'white',
                    padding: '8px 16px',
                    borderRadius: '6px',
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontSize: '15px',
                    boxShadow: '0 2px 8px rgba(3,199,90,0.15)'
                  }}
                >
                  네이버 지도에서 보기
                </a>
              </div>
            </BusinessCard>
          ))}
        </BusinessesGrid>
      )}
      {error && <Error>{error}</Error>}
    </BusinessesContainer>
  );
}

export default Businesses;
