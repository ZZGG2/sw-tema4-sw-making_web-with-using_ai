const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');


// 주차장 목록 조회 (CSV 파일 기반)
router.get('/', async (req, res) => {
  try {
  const results = [];
  const { city, type, keyword } = req.query;
    const csvPath = path.join(__dirname, '../parking.csv');

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
  // 지역 필터 제거: 모든 주차장 표시
        if (city && !data['주차장지번주소'].includes(city) && !data['주차장도로명주소'].includes(city)) return;
        if (type && data['주차장구분'] !== type) return;
        if (keyword) {
          const lowerKeyword = keyword.toLowerCase();
          const name = (data['주차장명'] || '').toLowerCase();
          const address = ((data['주차장도로명주소'] || '') + (data['주차장지번주소'] || '')).toLowerCase();
          if (!name.includes(lowerKeyword) && !address.includes(lowerKeyword)) return;
        }
        results.push({
          id: data['주차장관리번호'],
          name: data['주차장명'],
          address: data['주차장도로명주소'] || data['주차장지번주소'],
          type: data['주차장구분'],
          lotType: data['주차장유형'],
          totalSpaces: data['주차구획수'],
          fee: data['요금정보'],
          coordinates: {
            lat: parseFloat(data['위도']),
            lon: parseFloat(data['경도'])
          },
          phone: data['연락처']
        });
      })
      .on('end', () => {
        res.json({
          success: true,
          data: results,
          total: results.length
        });
      })
      .on('error', (error) => {
        console.error('CSV 읽기 오류:', error);
        res.status(500).json({
          success: false,
          error: '주차장 정보를 가져오는 중 오류가 발생했습니다.'
        });
      });
  } catch (error) {
    console.error('주차장 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '주차장 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 특정 주차장 상세 정보
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const parking = PARKING_DATA.find(p => p.id === parseInt(id));
    
    if (!parking) {
      return res.status(404).json({
        success: false,
        error: '주차장을 찾을 수 없습니다.'
      });
    }
    
    // 실시간 주차 공간 정보 업데이트 (시뮬레이션)
    const updatedParking = {
      ...parking,
      availableSpaces: Math.floor(Math.random() * parking.totalSpaces),
      lastUpdated: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: updatedParking
    });
  } catch (error) {
    console.error('주차장 상세 정보 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '주차장 정보를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

// 주차장 검색
router.get('/search/:keyword', async (req, res) => {
  try {
    const { keyword } = req.params;
    const results = [];
    const csvPath = path.join(__dirname, '../parking.csv');
    const search = keyword.trim().toLowerCase();

    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        // 강원도 지역만 필터링
        const isGangwon = (data['주차장지번주소'] && data['주차장지번주소'].includes('강원도')) ||
                          (data['주차장도로명주소'] && data['주차장도로명주소'].includes('강원도'));
        if (!isGangwon) return;
        // 검색어가 주차장명 또는 주소에 포함되어 있으면 결과에 추가 (소문자, 공백 제거)
        const name = (data['주차장명'] || '').toLowerCase();
        const roadAddr = (data['주차장도로명주소'] || '').toLowerCase();
        const jibunAddr = (data['주차장지번주소'] || '').toLowerCase();
        if (
          name.includes(search) ||
          roadAddr.includes(search) ||
          jibunAddr.includes(search)
        ) {
          results.push({
            id: data['주차장관리번호'],
            name: data['주차장명'],
            address: data['주차장도로명주소'] || data['주차장지번주소'],
            type: data['주차장구분'],
            lotType: data['주차장유형'],
            totalSpaces: data['주차구획수'],
            fee: data['요금정보'],
            coordinates: {
              lat: parseFloat(data['위도']),
              lon: parseFloat(data['경도'])
            },
            phone: data['연락처']
          });
        }
      })
      .on('end', () => {
        res.json({
          success: true,
          keyword,
          data: results,
          total: results.length
        });
      })
      .on('error', (error) => {
        console.error('CSV 검색 오류:', error);
        res.status(500).json({
          success: false,
          error: '주차장 검색 중 오류가 발생했습니다.'
        });
      });
  } catch (error) {
    console.error('주차장 검색 오류:', error);
    res.status(500).json({
      success: false,
      error: '주차장 검색 중 오류가 발생했습니다.'
    });
  }
});

// 주차장 통계 정보
router.get('/stats/summary', async (req, res) => {
  try {
    const csvPath = path.join(__dirname, '../parking.csv');
    const results = [];
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (data) => {
        results.push({
          type: data['주차장구분'],
          totalSpaces: parseInt(data['주차구획수']) || 0,
          availableSpaces: parseInt(data['주차구획수']) || 0 // 실제 available 정보 없으면 total로 대체
        });
      })
      .on('end', () => {
        const totalParkingLots = results.length;
        const totalSpaces = results.reduce((sum, p) => sum + p.totalSpaces, 0);
        const totalAvailable = results.reduce((sum, p) => sum + p.availableSpaces, 0);
        const occupancyRate = totalSpaces === 0 ? 0 : Math.round(((totalSpaces - totalAvailable) / totalSpaces) * 100);

        const typeStats = results.reduce((stats, p) => {
          stats[p.type] = (stats[p.type] || 0) + 1;
          return stats;
        }, {});

        res.json({
          success: true,
          stats: {
            totalParkingLots,
            totalSpaces,
            totalAvailable,
            occupancyRate: `${occupancyRate}%`,
            byType: typeStats
          }
        });
      })
      .on('error', (error) => {
        console.error('주차장 통계 조회 오류:', error);
        res.status(500).json({
          success: false,
          error: '주차장 통계를 가져오는 중 오류가 발생했습니다.'
        });
      });
  } catch (error) {
    console.error('주차장 통계 조회 오류:', error);
    res.status(500).json({
      success: false,
      error: '주차장 통계를 가져오는 중 오류가 발생했습니다.'
    });
  }
});

module.exports = router;
