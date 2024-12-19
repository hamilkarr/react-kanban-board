import React from 'react';
import { hoursSelector, minutesState } from './atoms.tsx';
import { useRecoilState } from 'recoil';

function App() {
    const [minutes, setMinutes] = useRecoilState(minutesState); 
    const [hours, setHours] = useRecoilState(hoursSelector);
    const onMinutesChange = (event: React.ChangeEvent<HTMLInputElement>) => {   
        setMinutes(Number(event.target.value));
        console.log(minutes);
    }
    const onHoursChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setHours(Number(event.target.value));
    }
    return (<div>
        <input value={minutes} type="number" placeholder="Minutes" onChange={onMinutesChange} />
        <input value={hours} type="number" placeholder="Hours" onChange={onHoursChange} />
    </div>);
}

export default App;
