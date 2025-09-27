
const express = require('express');
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const router = express.Router();

// pet_friendly.csv 파싱 함수
function readPetFriendlyCSV(keyword) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, '../pet_friendly.csv'))
      .pipe(csv())
      .on('data', (row) => {
        // 검색어가 있으면 이름/주소/지역에 포함되는 것만
        if (!keyword ||
          row['장소']?.includes(keyword) ||
          row['주소']?.includes(keyword) ||
          row['지역']?.includes(keyword)
        ) {
          results.push({
            id: row['번호'],
            name: row['장소'],
            city: row['지역'],
            address: row['주소'],
            type: row['구분'],
            lat: parseFloat(row['위도']),
            lon: parseFloat(row['경도']),
            phone: row['전화번호']
          });
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

const PET_CARE_TIPS = [
  {
    id: 1,
    title: '강원도 겨울철 반려동물 관리법',
    content: '강원도의 추운 겨울철에는 반려동물의 체온 유지가 중요합니다. 실내 온도를 적절히 유지하고, 외출 시에는 따뜻한 옷을 입혀주세요.',
    category: '건강관리',
    date: '2024-01-15'
  },
  {
    id: 2,
    title: '산악지역 반려동물 산책 주의사항',
    content: '강원도의 산악지역에서는 급격한 고도 변화로 인한 건강 문제를 주의해야 합니다. 충분한 휴식과 물 공급이 필요합니다.',
    category: '산책',
    date: '2024-01-10'
  },
  {
    id: 3,
    title: '지역별 동물병원 응급상황 대처법',
    content: '강원도는 지리적으로 응급상황 발생 시 접근이 어려울 수 있습니다. 평소 응급병원 위치를 파악하고 연락처를 준비해두세요.',
    category: '응급처치',
    date: '2024-01-05'
  }
];

// 반려동물 서비스 목록 조회 (CSV 기반)
router.get('/services', async (req, res) => {
  try {
    const { type, city } = req.query;
    // CSV 전체 읽기
    let data = await readPetFriendlyCSV();
    // type, city 필터 적용
    if (type) {
      data = data.filter(service => service.type === type);
    }
    if (city) {
      data = data.filter(service => service.city && service.city.includes(city));
    }
    res.json({
      success: true,
      data,
      total: data.length
    });
  } catch (error) {
    console.error('반려동물 서비스 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '반려동물 서비스 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 반려동물 동반 가능 장소 조회 (검색어 기반)
router.get('/places', async (req, res) => {
  try {
    const { keyword } = req.query;
    const data = await readPetFriendlyCSV(keyword);
    res.json({
      success: true,
      data,
      total: data.length
    });
  } catch (error) {
    console.error('반려동물 동반 장소 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '반려동물 동반 장소 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 반려동물 케어 팁 조회
router.get('/tips', async (req, res) => {
  try {
    const { category } = req.query;
    
    let filteredData = [...PET_CARE_TIPS];
    
    if (category) {
      filteredData = filteredData.filter(tip => tip.category === category);
    }
    
    res.json({
      success: true,
      data: filteredData,
      total: filteredData.length
    });
  } catch (error) {
    console.error('반려동물 케어 팁 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '반려동물 케어 팁을 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 특정 서비스 상세 정보
router.get('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const service = PET_SERVICES.find(s => s.id === parseInt(id));
    
    if (!service) {
      return res.status(404).json({
        success: false,
        error: '서비스를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: service
    });
  } catch (error) {
    console.error('서비스 상세 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '서비스 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 반려동물 관련 통계
router.get('/stats', async (req, res) => {
  try {
    const serviceStats = PET_SERVICES.reduce((stats, service) => {
      stats[service.type] = (stats[service.type] || 0) + 1;
      return stats;
    }, {});
    
    const placeStats = PET_FRIENDLY_PLACES.reduce((stats, place) => {
      stats[place.type] = (stats[place.type] || 0) + 1;
      return stats;
    }, {});
    
    res.json({
      success: true,
      stats: {
        totalServices: PET_SERVICES.length,
        totalPlaces: PET_FRIENDLY_PLACES.length,
        totalTips: PET_CARE_TIPS.length,
        servicesByType: serviceStats,
        placesByType: placeStats
      }
    });
  } catch (error) {
    console.error('반려동물 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '반려동물 통계를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
