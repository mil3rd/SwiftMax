"use client";
import React, { useState, useEffect } from 'react';

type FormData = {
  name: string;
  step: number;
  gender: string;
  height: number;
  weight: number;
  targetWeight: number;
  healthConditions: string[];
  equipment: boolean;
  equipmentList: string[];
  fitnessGoal: string;
  workoutDays: string;
  workoutDuration: string;
};

const initialFormData: FormData = {
  name: '',
  step: 0,
  gender: '',
  height: 0,
  weight: 0,
  targetWeight: 0,
  healthConditions: [],
  equipment: false,
  equipmentList: [],
  fitnessGoal: '',
  workoutDays: '',
  workoutDuration: '',
};

function App() {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem('formData');
    if (savedData) {
      setFormData(JSON.parse(savedData));
    }
  }, []);

  // Save form data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const handleNext = () => {
    setFormData(prev => ({ ...prev, step: prev.step + 1 }));
  };

  const handleRestart = () => {
    // Clear form data and reset to initial state
    setFormData(initialFormData);
    // Remove saved data from localStorage
    localStorage.removeItem('formData');
  };

  const calculateTimeToGoal = () => {
    const weightDiff = Math.abs(formData.weight - formData.targetWeight);
    // const daysPerWeek = parseInt(formData.workoutDays.split('-')[0]);
    // const minutesPerDay = parseInt(formData.workoutDuration.split('-')[0]);
    
    const weeksToGoal = weightDiff * 2;
    return Math.ceil(weeksToGoal);
  };

  const getWorkoutPlan = () => {
    const hasHealthIssues = formData.healthConditions.includes('medical');
    const hasPostSurgery = formData.healthConditions.includes('surgery') || formData.healthConditions.includes('breast');
    
    let cardio = '';
    // let strength = '';
    let exercises = '';

    if (hasHealthIssues || hasPostSurgery) {
      // มีข้อจำกัดทางร่างกาย
      cardio = 'เดินเร็ว 30-45 นาที หรือปั่นจักรยาน 20-30 นาที (แรงต้านเบาถึงปานกลาง)';
      
      if (formData.equipment) {
        // มีข้อจำกัดและมีอุปกรณ์
        exercises = `พิลาทิส:
• Plank with knee drop - 40 วินาที
• The Hundred (งอเข่า) - 40 วินาที
• Small leg circle (งอเข่า) - 40 วินาที
• Side-lying leg lift (ใช้หมอนรองสะโพก) - 40 วินาที
• Plank (เข่าลง) - 40 วินาที

ทำทั้งหมด 3 เซต พักระหว่างเซต 1-2 นาที`;
      } else {
        // มีข้อจำกัดแต่ไม่มีอุปกรณ์
        exercises = `พิลาทิส:
• Plank with leg lift - 40 วินาที
• The Hundred - 40 วินาที
• Leg circle - 40 วินาที
• Side lying leg lift - 40 วินาที
• Plank - 1 นาที

ทำทั้งหมด 3 เซต พักระหว่างเซต 1-2 นาที`;
      }
    } else {
      // ไม่มีข้อจำกัดทางร่างกาย
      cardio = `เลือกหนึ่งในตัวเลือกต่อไปนี้:
• วิ่ง 30-45 นาที
• โดดเชือก 30-45 นาที
• ปั่นจักรยาน 30-45 นาที
• HIIT: วิ่งเร็ว 20 วินาที สลับกับวิ่งช้า 40 วินาที ทำต่อเนื่อง 30-45 นาที`;

      if (formData.equipment) {
        // ไม่มีข้อจำกัดและมีอุปกรณ์
        exercises = `เวทเทรนนิ่ง:
• Squat with Overhead Press (ใช้ดัมเบล) - 12-15 ครั้ง
• Lunge with Bicep Curl (ใช้ดัมเบล) - 12-15 ครั้ง
• Dumbbell Row - ข้างละ 10-12 ครั้ง
• Plank with Shoulder Tap - 12-15 ครั้ง
• Plank - ค้าง 1 นาที

ทำทั้งหมด 3 เซต พักระหว่างเซต 1-2 นาที`;
      } else {
        // ไม่มีข้อจำกัดและไม่มีอุปกรณ์
        exercises = `เวทเทรนนิ่ง:
• Squat with overhead press - 12-15 ครั้ง
• Lunge with bicep curl - 12-15 ครั้ง
• แพลงก์ - 1 นาที

ทำทั้งหมด 3 เซต พักระหว่างเซต 1-2 นาที`;
      }
    }
    
    return { cardio, exercises };
  };

  const renderStep = () => {
    switch(formData.step) {
      case 0:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">ยินดีต้อนรับสู่ SwiftMax!</h2>
            <input
              type="text"
              placeholder="กรุณากรอกชื่อของคุณ"
              className="w-full p-2 border rounded"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <div>
              <p>เราจะถามคุณเกี่ยวกับ:</p>
              <ol className="list-decimal ml-6 mt-2">
                <li>ข้อมูลพื้นฐาน</li>
                <li>ระดับการออกกำลังกาย</li>
                <li>ไลฟ์สไตล์</li>
              </ol>
            </div>
            <button
              onClick={handleNext}
              disabled={!formData.name}
              className="w-full bg-blue-600 text-white p-3 rounded-lg disabled:bg-gray-400"
            >
              เริ่มการประเมิน
            </button>
          </div>
        );

      case 1:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">ข้อมูลพื้นฐาน</h2>
            <select
              className="w-full p-2 border rounded"
              value={formData.gender}
              onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            >
              <option value="">เลือกเพศ</option>
              <option value="male">ชาย</option>
              <option value="female">หญิง</option>
              <option value="other">อื่นๆ</option>
            </select>
            
            <input
              type="number"
              placeholder="ส่วนสูง (ซม.)"
              className="w-full p-2 border rounded"
              value={formData.height || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, height: Number(e.target.value) }))}
            />
            
            <input
              type="number"
              placeholder="น้ำหนักปัจจุบัน (กก.)" 
              className="w-full p-2 border rounded"
              value={formData.weight || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, weight: Number(e.target.value) }))}
            />
            
            <input
              type="number"
              placeholder="น้ำหนักเป้าหมาย (กก.)"
              className="w-full p-2 border rounded"
              value={formData.targetWeight || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, targetWeight: Number(e.target.value) }))}
            />
            
            <div className="space-y-2">
              <p className="font-medium">ข้อจำกัดทางร่างกาย:</p>
              <div className="space-y-1">
                {['medical', 'breast', 'surgery', 'none'].map((condition) => (
                  <label key={condition} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.healthConditions.includes(condition)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            healthConditions: [...prev.healthConditions, condition]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            healthConditions: prev.healthConditions.filter(c => c !== condition)
                          }));
                        }
                      }}
                    />
                    <span>{
                      condition === 'medical' ? 'โรคประจำตัว' :
                      condition === 'breast' ? 'เคยผ่าตัดเสริมหน้าอก' :
                      condition === 'surgery' ? 'เคยผ่าตัดอื่นๆ' :
                      'ไม่มี'
                    }</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button
              onClick={handleNext}
              disabled={!formData.gender || !formData.height || !formData.weight || !formData.targetWeight}
              className="w-full bg-blue-600 text-white p-3 rounded-lg disabled:bg-gray-400"
            >
              ถัดไป
            </button>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">ระดับการออกกำลังกาย</h2>
            
            <div className="space-y-2">
              <p className="font-medium">คุณมีอุปกรณ์ออกกำลังกายหรือไม่?</p>
              <div className="space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="equipment"
                    checked={formData.equipment}
                    onChange={() => setFormData(prev => ({ ...prev, equipment: true }))}
                  />
                  <span className="ml-2">มี</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="equipment"
                    checked={!formData.equipment}
                    onChange={() => setFormData(prev => ({ ...prev, equipment: false }))}
                  />
                  <span className="ml-2">ไม่มี</span>
                </label>
              </div>
            </div>
            
            {formData.equipment && (
              <div className="space-y-2">
                <p className="font-medium">เลือกอุปกรณ์ที่มี:</p>
                {['dumbbells', 'resistance-bands'].map((item) => (
                  <label key={item} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.equipmentList.includes(item)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData(prev => ({
                            ...prev,
                            equipmentList: [...prev.equipmentList, item]
                          }));
                        } else {
                          setFormData(prev => ({
                            ...prev,
                            equipmentList: prev.equipmentList.filter(i => i !== item)
                          }));
                        }
                      }}
                    />
                    <span>{item === 'dumbbells' ? 'ดัมเบล' : 'ยางยืด'}</span>
                  </label>
                ))}
              </div>
            )}
            
            <div className="space-y-2">
              <p className="font-medium">เป้าหมายในการออกกำลังกาย?</p>
              <select
                className="w-full p-2 border rounded"
                value={formData.fitnessGoal}
                onChange={(e) => setFormData(prev => ({ ...prev, fitnessGoal: e.target.value }))}
              >
                <option value="">เลือกเป้าหมาย</option>
                <option value="weight-loss">ลดน้ำหนัก</option>
                <option value="strength">เพิ่มความแข็งแรง</option>
                <option value="fat-loss">ลดไขมัน</option>
              </select>
            </div>
            
            <button
              onClick={handleNext}
              disabled={!formData.fitnessGoal}
              className="w-full bg-blue-600 text-white p-3 rounded-lg disabled:bg-gray-400"
            >
              ถัดไป
            </button>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">ไลฟ์สไตล์</h2>
            
            <div className="space-y-2">
              <p className="font-medium">คุณออกกำลังกายกี่วันต่อสัปดาห์?</p>
              <select
                className="w-full p-2 border rounded"
                value={formData.workoutDays}
                onChange={(e) => setFormData(prev => ({ ...prev, workoutDays: e.target.value }))}
              >
                <option value="">เลือกความถี่</option>
                <option value="1-3">1-3 วัน</option>
                <option value="4-5">4-5 วัน</option>
                <option value="7">7 วัน</option>
                <option value="0">ไม่ได้ออกกำลังกาย</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <p className="font-medium">ออกกำลังกายนานเท่าไหร่ต่อครั้ง?</p>
              <select
                className="w-full p-2 border rounded"
                value={formData.workoutDuration}
                onChange={(e) => setFormData(prev => ({ ...prev, workoutDuration: e.target.value }))}
              >
                <option value="">เลือกระยะเวลา</option>
                <option value="5-10">5-10 นาที</option>
                <option value="15-30">15-30 นาที</option>
                <option value="45+">45+ นาที</option>
                <option value="0">ไม่ได้ออกกำลังกาย</option>
              </select>
            </div>
            
            <button
              onClick={handleNext}
              disabled={!formData.workoutDays || !formData.workoutDuration}
              className="w-full bg-blue-600 text-white p-3 rounded-lg disabled:bg-gray-400"
            >
              ดูผลการประเมิน
            </button>
          </div>
        );

      case 4:
        const timeToGoal = calculateTimeToGoal();
        const plan = getWorkoutPlan();
        
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold mb-6">ผลการประเมินของคุณ</h2>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">ระยะเวลาถึงเป้าหมาย</h3>
              <p>จากน้ำหนักปัจจุบัน {formData.weight} กก. สู่น้ำหนักเป้าหมาย {formData.targetWeight} กก.
                 คุณสามารถบรรลุเป้าหมายได้ในประมาณ {timeToGoal} สัปดาห์ ด้วยการออกกำลังกายอย่างสม่ำเสมอ</p>
            </div>
            
            <div className="bg-green-50 p-4 rounded-lg space-y-4">
              <h3 className="font-bold text-lg">แผนการออกกำลังกายที่แนะนำ</h3>
              
              <div className="space-y-2">
                <div>
                  <h4 className="font-semibold">คาร์ดิโอ</h4>
                  <p className="whitespace-pre-line">{plan.cardio}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold">การเสริมสร้างกล้ามเนื้อ</h4>
                  <p className="whitespace-pre-line">{plan.exercises}</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleRestart}
              className="w-full bg-blue-600 text-white p-3 rounded-lg"
            >
              เริ่มใหม่
            </button>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full text-gray-600">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-2">
            <p className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">SwiftMax</h1>
          </div>
          {formData.step > 0 && formData.step < 4 && (
            <div className="text-sm">
              ขั้นตอนที่ {formData.step} จาก 3
            </div>
          )}
        </div>
        
        {renderStep()}
      </div>
    </div>
  );
}

export default App;