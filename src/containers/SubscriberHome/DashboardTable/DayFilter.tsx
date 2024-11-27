import React, { useEffect, useRef, useCallback } from 'react';

interface DayFilterProps {
  dayList: Array<{ value: string; label: string }>;
  setDayFilterData: (value: { value: string; label: string }) => void;
  dayFilterData: { value: string; label: string };
  setDayFilterShow: (value: boolean) => void;
}

const DayFilter: React.FC<DayFilterProps> = ({ dayList, setDayFilterData, dayFilterData, setDayFilterShow }) => {
  const popupRef = useRef<HTMLDivElement>(null);

  const handleClickOutside = useCallback((event: MouseEvent) => {
    if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
      setDayFilterShow(false);
    }
  }, [setDayFilterShow]);

  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setDayFilterShow(false);
    }
  }, [setDayFilterShow]);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscapeKey);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscapeKey);
    };
  }, [handleClickOutside, handleEscapeKey]);

  const handleItemClick = useCallback((value: { value: string; label: string }) => {
    setDayFilterShow(false);
    setDayFilterData(value);
  }, [setDayFilterShow, setDayFilterData]);

  return (
    <>
      <div className="dayFilter" ref={popupRef}>
        <div className="moduleBody body">
          <ul>
            {dayList?.map((value, index) => (
              <li
                key={`dayFilter_key_${index}`}
                className={dayFilterData.value === value.value ? 'active' : ''}
                onClick={() => handleItemClick(value)}
              >
                {value.label}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <style jsx>{`
        .dayFilter {
          position: absolute;
          right: 0;
          top: 32px;
          background: #fff;
          width: 170px;
          height: auto;
          max-height: 280px;
          overflow-x: hidden;
          overflow-y: auto;
          z-index: 2;
          border: solid 1px rgba(204, 204, 204, 1);
          box-shadow: 0 0 4px 0 rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          .body {
            margin: 0;
            padding: 0;
            ul {
              margin: 0;
              padding: 0;
              list-style-type: none;
              li {
                padding: 8px 16px;
                font-size: 12px;
                font-weight: 400;
                cursor: pointer;
                &.active,
                &:hover {
                  font-weight: 700;
                }
                &.active {
                  background: rgba(244, 244, 244, 1);
                }
                & + li {
                  border-top: solid 1px rgba(204, 204, 204, 1);
                }
                &:first-child {
                  border-top-left-radius: 8px;
                  border-top-right-radius: 8px;
                }
                &:last-child {
                  border-bottom-left-radius: 8px;
                  border-bottom-right-radius: 8px;
                }
              }
            }
          }
        }
      `}</style>
    </>
  );
};

export default DayFilter;