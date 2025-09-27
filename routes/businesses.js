const express = require('express');
const router = express.Router();


const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// good_business.csv 파싱 함수
function readGoodBusinessCSV(keyword) {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(path.join(__dirname, '../good_business.csv'))
      .pipe(csv())
      .on('data', (row) => {
        // 검색어가 있으면 업소명/주소/업종에 포함되는 것만
        if (!keyword ||
          row['업소명']?.includes(keyword) ||
          row['주소']?.includes(keyword) ||
          row['업종']?.includes(keyword)
        ) {
          results.push({
            id: row['업소명'] + row['주소'],
            name: row['업소명'],
            category: row['업종'],
            address: row['주소'],
            phone: row['연락처']
          });
        }
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
}

const BUSINESS_CATEGORIES = [
  '공공기관', '의료기관', '복지기관', '교육기관', 
  '사회적기업', '협동조합', '자원봉사단체', '기타'
];

// 착한업소 목록 조회 (검색어 기반)
router.get('/', async (req, res) => {
  try {
    const { keyword } = req.query;
    const data = await readGoodBusinessCSV(keyword);
    res.json({
      success: true,
      data,
      total: data.length
    });
  } catch (error) {
    console.error('착한업소 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '착한업소 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 특정 업소 상세 정보
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const business = GOOD_BUSINESSES.find(b => b.id === parseInt(id));
    
    if (!business) {
      return res.status(404).json({
        success: false,
        error: '업소를 찾을 수 없습니다.'
      });
    }
    
    res.json({
      success: true,
      data: business
    });
  } catch (error) {
    console.error('업소 상세 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '업소 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 업소 검색
router.get('/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    
    const searchResults = GOOD_BUSINESSES.filter(business =>
      business.name.includes(keyword) ||
      business.address.includes(keyword) ||
      business.description.includes(keyword) ||
      business.services.some(service => service.includes(keyword)) ||
      business.goodDeeds.some(deed => deed.includes(keyword))
    );
    
    res.json({
      success: true,
      keyword,
      data: searchResults,
      total: searchResults.length
    });
  } catch (error) {
    console.error('업소 검색 오류:', error);
    res.status(500).json({
      success: false,
      error: '업소 검색 중 오류가 발생했습니다.'
    });
  }
});

// 카테고리별 통계
router.get('/stats/categories', async (req, res) => {
  try {
    const categoryStats = BUSINESS_CATEGORIES.map(category => ({
      category,
      count: GOOD_BUSINESSES.filter(business => business.category === category).length
    }));
    
    res.json({
      success: true,
      data: categoryStats
    });
  } catch (error) {
    console.error('카테고리 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '카테고리 통계를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 전체 통계 정보
router.get('/stats/summary', async (req, res) => {
  try {
    const totalBusinesses = GOOD_BUSINESSES.length;
    const verifiedBusinesses = GOOD_BUSINESSES.filter(b => b.verified).length;
    const averageRating = (GOOD_BUSINESSES.reduce((sum, b) => sum + b.rating, 0) / totalBusinesses).toFixed(1);
    const totalReviews = GOOD_BUSINESSES.reduce((sum, b) => sum + b.reviews, 0);
    
    const cityStats = GOOD_BUSINESSES.reduce((stats, business) => {
      const city = business.address.split(' ')[1]; // 강원도 다음의 시/군/구
      stats[city] = (stats[city] || 0) + 1;
      return stats;
    }, {});
    
    res.json({
      success: true,
      stats: {
        totalBusinesses,
        verifiedBusinesses,
        verificationRate: `${Math.round((verifiedBusinesses / totalBusinesses) * 100)}%`,
        averageRating,
        totalReviews,
        businessesByCity: cityStats
      }
    });
  } catch (error) {
    console.error('통계 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '통계 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 인기 착한업소 (평점 기준)
router.get('/popular/top-rated', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const topRated = GOOD_BUSINESSES
      .sort((a, b) => b.rating - a.rating)
      .slice(0, parseInt(limit));
    
    res.json({
      success: true,
      data: topRated
    });
  } catch (error) {
    console.error('인기 업소 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '인기 업소 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
