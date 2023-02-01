import { useState } from 'react';
import './comboBox.scss';

export function ComboBox() {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<>
			<div className="comboBox" onClick={() => {}}>
				<input className='comboBox__input'
					placeholder="Enter currency..."
					onFocus={(e) => {
						setIsOpen(true);
					}}
					onBlur={() => setIsOpen(false)}
				></input>
			</div>
			{isOpen && <div className="dropDown"></div>}
		</>
	);
}
