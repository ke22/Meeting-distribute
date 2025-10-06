
import React, { useState, useCallback } from 'react';
import { ScheduleItem, PresentationSlot, Student, LotteryRole, LotteryWinner } from './types';
import { ClockIcon, UserIcon, VideoCameraIcon, QuestionMarkCircleIcon, InfoIcon, TicketIcon, ClipboardListIcon, TableIcon, SparklesIcon } from './components/icons';

const scheduleData: ScheduleItem[] = [
  { time: '19:00 – 19:05', activity: '開場與流程說明', duration: '5 分鐘' },
  { time: '19:05 – 19:55', activity: '前 5 位提報＋講評', duration: '50 分鐘' },
  { time: '19:55 – 20:05', activity: '中場休息', duration: '10 分鐘' },
  { time: '20:05 – 20:55', activity: '後 5 位提報＋講評', duration: '50 分鐘' },
  { time: '20:55 – 21:25', activity: '老師綜合講評與全班討論', duration: '30 分鐘' },
  { time: '21:25 – 21:30', activity: '收尾與後續工作說明', duration: '5 分鐘' },
];

const createInitialSlots = (): PresentationSlot[] => {
  const slots: PresentationSlot[] = [];
  const session1Start = new Date();
  session1Start.setHours(19, 5, 0, 0);

  for (let i = 0; i < 5; i++) {
    const slotTime = new Date(session1Start.getTime() + i * 11 * 60000); // 11 minutes per slot
    const time = `${slotTime.getHours().toString().padStart(2, '0')}:${slotTime.getMinutes().toString().padStart(2, '0')}`;
    slots.push({ id: i + 1, time, studentName: null });
  }

  const session2Start = new Date();
  session2Start.setHours(20, 5, 0, 0);
  for (let i = 0; i < 5; i++) {
    const slotTime = new Date(session2Start.getTime() + i * 11 * 60000); // 11 minutes per slot
    const time = `${slotTime.getHours().toString().padStart(2, '0')}:${slotTime.getMinutes().toString().padStart(2, '0')}`;
    slots.push({ id: i + 6, time, studentName: null });
  }

  return slots;
};

const initialSlots: PresentationSlot[] = createInitialSlots();

const lotteryPositions = [
    { role: LotteryRole.Videographer, count: 1, icon: <VideoCameraIcon /> },
    { role: LotteryRole.NoteTaker, count: 3, icon: <QuestionMarkCircleIcon /> },
    { role: LotteryRole.CleaningDuty, count: 2, icon: <SparklesIcon /> }
];

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
  <div className={`bg-[#f5f5f5] border border-[#cccccc] rounded-2xl shadow-sm p-6 text-[#666666] ${className}`}>
    {children}
  </div>
);

const CardTitle: React.FC<{ children: React.ReactNode; icon?: React.ReactNode; }> = ({ children, icon }) => (
  <h2 className="text-2xl font-bold text-[#7F0019] mb-4 flex items-center">
    {icon && <span className="mr-3">{icon}</span>}
    {children}
  </h2>
);

const ScheduleCard: React.FC<{ schedule: ScheduleItem[] }> = ({ schedule }) => (
  <Card className="h-full">
    <CardTitle icon={<ClockIcon className="w-7 h-7" />}>流程表</CardTitle>
    <ul className="space-y-3">
      {schedule.map((item, index) => (
        <li key={index} className="flex justify-between items-center p-3 bg-white rounded-lg">
          <div className="flex flex-col">
            <span className="font-semibold text-[#666666]">{item.activity}</span>
            <span className="text-sm text-neutral-500">{item.time}</span>
          </div>
          <span className="text-sm font-mono text-white bg-[#bb9f85] px-2 py-1 rounded">{item.duration}</span>
        </li>
      ))}
    </ul>
  </Card>
);

const RegistrationCard: React.FC<{
  slots: PresentationSlot[];
  onRegister: (slotId: number, studentName: string) => boolean;
  onCancel: (slotId: number) => void;
  error: string | null;
}> = ({ slots, onRegister, onCancel, error }) => {
  const [name, setName] = useState('');

  const handleRegisterClick = (slotId: number) => {
    const success = onRegister(slotId, name);
    if (success) {
      setName('');
    }
  };

  return (
    <Card>
      <CardTitle icon={<ClipboardListIcon className="w-7 h-7" />}>提報時間登記</CardTitle>
      <div className="mb-4">
        <label htmlFor="studentName" className="block text-sm font-medium text-neutral-600 mb-2">登記姓名</label>
        <input
          type="text"
          id="studentName"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="請輸入你的名字"
          className="w-full bg-white border border-[#cccccc] rounded-md py-2 px-3 text-[#666666] placeholder-neutral-400 focus:ring-2 focus:ring-[#bb9f85] focus:border-[#bb9f85] transition"
        />
        {error && <p className="text-red-600 mt-2 text-sm">{error}</p>}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {slots.map(slot => (
          <div key={slot.id} className={`p-3 rounded-lg flex items-center justify-between transition-all duration-300 ${slot.studentName ? 'bg-[#9aa27c]/20' : 'bg-stone-100'}`}>
            <span className="font-semibold text-neutral-700">{`${slot.id}. 提報時間 ${slot.time}`}</span>
            {slot.studentName ? (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2 flex-grow min-w-0">
                  <UserIcon className="w-5 h-5 text-[#9aa27c] flex-shrink-0" />
                  <span className="text-[#9aa27c] font-bold truncate" title={slot.studentName}>{slot.studentName}</span>
                </div>
                <button
                  onClick={() => onCancel(slot.id)}
                  className="px-2 py-1 text-xs font-semibold text-white bg-[#666666] rounded-md hover:bg-[#666666]/90 transition flex-shrink-0"
                  aria-label={`取消 ${slot.studentName} 的登記`}
                >
                  取消
                </button>
              </div>
            ) : (
              <button
                onClick={() => handleRegisterClick(slot.id)}
                disabled={!name.trim()}
                className="px-3 py-1 text-sm font-semibold text-white bg-[#7F0019] rounded-md hover:bg-[#7F0019]/90 disabled:bg-stone-300 disabled:cursor-not-allowed transition"
              >
                登記
              </button>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

const LotteryCard: React.FC<{
  students: Student[];
  winners: LotteryWinner[];
  onRunLottery: () => void;
  isLotteryRun: boolean;
  isDrawing: boolean;
  lotteryPositions: typeof lotteryPositions;
}> = ({ students, winners, onRunLottery, isLotteryRun, isDrawing, lotteryPositions }) => {
  const canRunLottery = students.length > 0;

  const getButtonText = () => {
    if (isLotteryRun) return '抽籤已完成';
    if (isDrawing) return '抽籤中...';
    return '開始抽籤';
  };
  
  const allLotterySlots = lotteryPositions.flatMap(({ role, count, icon }) =>
    Array.from({ length: count }, (_, i) => ({
      role,
      icon: React.cloneElement(icon, { className: "w-5 h-5 mr-2" }),
      instance: i,
    }))
  );

  const getRoleStyle = (role: LotteryRole) => {
    switch (role) {
      case LotteryRole.Videographer: return { text: 'text-[#7f9ebd]', bg: 'bg-[#7f9ebd]/20', icon: 'text-[#7f9ebd]' };
      case LotteryRole.NoteTaker: return { text: 'text-[#b5907d]', bg: 'bg-[#b5907d]/20', icon: 'text-[#b5907d]' };
      case LotteryRole.CleaningDuty: return { text: 'text-[#bb9f85]', bg: 'bg-[#bb9f85]/20', icon: 'text-[#bb9f85]' };
      default: return { text: 'text-neutral-700', bg: 'bg-stone-100', icon: 'text-neutral-400' };
    }
  };

  return (
    <Card>
      <CardTitle icon={<TicketIcon className="w-7 h-7" />}>職位抽籤</CardTitle>
      <p className="text-neutral-500 mb-4 text-sm">將從已登記的同學中抽出：1 位「錄影同學」、3 位「紀錄同學」及 2 位「打掃」。</p>
      <button
        onClick={onRunLottery}
        disabled={!canRunLottery || isLotteryRun || isDrawing}
        className="w-full py-3 px-4 mb-4 text-lg font-bold text-white bg-[#7F0019] rounded-lg hover:bg-[#7F0019]/90 disabled:bg-stone-400 disabled:cursor-not-allowed transition-transform transform hover:scale-105 flex items-center justify-center"
      >
        {isDrawing && (
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        )}
        {getButtonText()}
      </button>
      {!canRunLottery && !isLotteryRun && <p className="text-center text-[#b5907d] text-sm">需要至少 1 位同學登記才能抽籤。</p>}
      
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-neutral-800 mb-3">抽籤結果一覽：</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {allLotterySlots.map((slot, index) => {
            const winnersForRole = winners.filter(w => w.role === slot.role);
            const winner = winnersForRole[slot.instance];
            const styles = getRoleStyle(slot.role);

            return (
              <div
                key={index}
                className={`p-3 rounded-lg flex items-center justify-between transition-all duration-300 ${winner ? styles.bg : 'bg-stone-100'}`}
              >
                <div className="flex items-center">
                  {React.cloneElement(slot.icon, { className: `w-5 h-5 mr-2 ${styles.icon}` })}
                  <span className="font-semibold text-neutral-700">{slot.role}</span>
                </div>

                <div className="flex items-center gap-2">
                  {winner ? (
                    <>
                      <UserIcon className={`w-5 h-5 ${styles.text}`} />
                      <span className={`font-bold ${styles.text}`}>{winner.student.name}</span>
                    </>
                  ) : (
                    <span className="text-neutral-400 italic text-sm">
                      {isDrawing ? '...' : '待抽籤'}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};

const ResultsDisplayCard: React.FC<{ slots: PresentationSlot[]; winners: LotteryWinner[] }> = ({ slots, winners }) => {
  const registeredSlots = slots.filter(slot => slot.studentName);

  const winnerRoles = new Map(winners.map(w => [w.student.name, w.role]));

  const getRoleStyle = (role: LotteryRole | undefined) => {
    if (!role) return 'text-neutral-400';
    switch (role) {
      case LotteryRole.Videographer:
        return 'text-[#7f9ebd] font-bold';
      case LotteryRole.NoteTaker:
        return 'text-[#b5907d] font-bold';
      case LotteryRole.CleaningDuty:
        return 'text-[#bb9f85] font-bold';
      default:
        return 'text-neutral-400';
    }
  };

  return (
    <Card>
      <CardTitle icon={<TableIcon className="w-7 h-7" />}>即時登記與抽籤結果</CardTitle>
      {registeredSlots.length === 0 ? (
        <p className="text-neutral-500 text-center py-4">目前尚無人登記。</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-stone-100">
              <tr>
                <th className="p-3 text-sm font-semibold text-neutral-600">提報時間</th>
                <th className="p-3 text-sm font-semibold text-neutral-600">登記同學</th>
                <th className="p-3 text-sm font-semibold text-neutral-600">擔任職位</th>
              </tr>
            </thead>
            <tbody>
              {registeredSlots.map((slot, index) => {
                const role = slot.studentName ? winnerRoles.get(slot.studentName) : undefined;
                return (
                  <tr key={slot.id} className="border-b border-[#cccccc] last:border-b-0">
                    <td className="p-3 font-mono text-[#bb9f85]">{slot.time}</td>
                    <td className="p-3 text-neutral-700">{slot.studentName}</td>
                    <td className={`p-3 ${getRoleStyle(role)}`}>
                      {role || '—'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};


const App: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [slots, setSlots] = useState<PresentationSlot[]>(initialSlots);
  const [lotteryWinners, setLotteryWinners] = useState<LotteryWinner[]>([]);
  const [nextStudentId, setNextStudentId] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [isLotteryRun, setIsLotteryRun] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);

  const resetLottery = useCallback(() => {
    if (isLotteryRun || lotteryWinners.length > 0) {
      setLotteryWinners([]);
      setIsLotteryRun(false);
      setIsDrawing(false);
    }
  }, [isLotteryRun, lotteryWinners.length]);

  const handleRegister = useCallback((slotId: number, studentName: string): boolean => {
    const trimmedName = studentName.trim();
    if (!trimmedName) {
      setError('姓名不能為空。');
      return false;
    }
    if (students.some(s => s.name.toLowerCase() === trimmedName.toLowerCase())) {
      setError('此姓名已被登記。');
      return false;
    }

    const newStudent: Student = { id: nextStudentId, name: trimmedName };
    setStudents(prev => [...prev, newStudent]);
    setSlots(prev => prev.map(slot => slot.id === slotId ? { ...slot, studentName: trimmedName } : slot));
    setNextStudentId(prev => prev + 1);
    setError(null);
    resetLottery();
    return true;
  }, [students, nextStudentId, resetLottery]);
  
  const handleCancelRegistration = useCallback((slotId: number) => {
    let studentNameToRemove: string | null = null;
    
    const updatedSlots = slots.map(slot => {
      if (slot.id === slotId) {
        studentNameToRemove = slot.studentName;
        return { ...slot, studentName: null };
      }
      return slot;
    });
  
    if (studentNameToRemove) {
      setStudents(prev => prev.filter(s => s.name !== studentNameToRemove));
      setSlots(updatedSlots);
      resetLottery();
      setError(null);
    }
  }, [slots, resetLottery]);

  const handleRunLottery = useCallback(async () => {
    if (students.length === 0 || isLotteryRun || isDrawing) return;

    setIsDrawing(true);
    setLotteryWinners([]); 

    await new Promise(resolve => setTimeout(resolve, 500));

    // Create a "deck" of role cards from lotteryPositions
    const roleCards: LotteryRole[] = lotteryPositions.flatMap(
        ({ role, count }) => Array(count).fill(role)
    );
    
    // Shuffle the role cards to simulate drawing from a hat
    roleCards.sort(() => 0.5 - Math.random());

    // Shuffle the students who are participating
    const shuffledStudents = [...students].sort(() => 0.5 - Math.random());

    // Pair shuffled students with shuffled roles
    const allWinners: LotteryWinner[] = [];
    const pairings = Math.min(shuffledStudents.length, roleCards.length);

    for (let i = 0; i < pairings; i++) {
        allWinners.push({
            student: shuffledStudents[i],
            role: roleCards[i],
        });
    }
    
    // Shuffle winners again for a random reveal order (good UX)
    allWinners.sort(() => 0.5 - Math.random());

    for (const winner of allWinners) {
      await new Promise(resolve => setTimeout(resolve, 600));
      setLotteryWinners(prev => [...prev, winner]);
    }
    
    setIsLotteryRun(true);
    setIsDrawing(false);
  }, [students, isLotteryRun, isDrawing]);

  return (
    <div className="min-h-screen p-4 sm:p-6 lg:p-8">
      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
            Oct 16團咪報告與任務分配
          </h1>
          <p className="mt-2 text-lg text-white/80">2025 19:00-21:30</p>
        </header>

        <div className="bg-[#faf7eb] border border-[#bb9f85] text-[#666666] px-4 py-3 rounded-lg relative mb-8 flex items-start" role="alert">
            <InfoIcon className="w-6 h-6 mr-3 mt-1 flex-shrink-0" />
            <div>
              <strong className="font-bold">重要提示：</strong>
              <span className="block sm:inline">此工具為單機演示版本。所有資料都儲存在您的瀏覽器中，刷新頁面將會遺失。若要實現多人即時登記並將結果存至 Google Sheet，需要後端服務支援。</span>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2 flex flex-col gap-8">
            <ScheduleCard schedule={scheduleData} />
          </div>
          <div className="lg:col-span-3 flex flex-col gap-8">
            <RegistrationCard slots={slots} onRegister={handleRegister} onCancel={handleCancelRegistration} error={error} />
            <LotteryCard students={students} winners={lotteryWinners} onRunLottery={handleRunLottery} isLotteryRun={isLotteryRun} isDrawing={isDrawing} lotteryPositions={lotteryPositions} />
          </div>
        </div>

        <div className="mt-8">
          <ResultsDisplayCard slots={slots} winners={lotteryWinners} />
        </div>
      </div>
    </div>
  );
};

export default App;
