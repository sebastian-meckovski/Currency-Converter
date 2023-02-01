import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import './comboBox.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

export function ComboBox({ dataSource, listItemRender, onItemClick, inputValue, onInputChange, onDropdownClosed, selectedValue }) {
	const [isOpen, setIsOpen] = useState(false);
	const ComboBoxRef = useRef(null);
	const wrapperRef = useRef(null);
	const DropdownRef = useRef(null);
	const inputRef = useRef(null);

	function resizeSelectBoxItems() {
		let selectboxHeader = ComboBoxRef.current;
		let headerStyles = selectboxHeader ? getComputedStyle(selectboxHeader) : null;
		let selectboxList = DropdownRef.current;

		if (selectboxList) {
			selectboxList.style.width = headerStyles ? headerStyles.width : null;
		}
	}
	window.addEventListener('resize', resizeSelectBoxItems);

	useLayoutEffect(() => {
		resizeSelectBoxItems();
	}, [DropdownRef, isOpen]);

	function useOutsideAlerter(ref, callback) {
		useEffect(() => {
			function handleClickOutside(event) {
				if (ref.current && !ref.current.contains(event.target)) {
					callback();
				}
			}
			document.addEventListener('mousedown', handleClickOutside);
			return () => {
				document.removeEventListener('mousedown', handleClickOutside);
			};
		}, [callback, ref]);
	}

	useOutsideAlerter(wrapperRef, () => {
		setIsOpen(false);
	});

	useEffect(() => {
		!isOpen && onDropdownClosed && onDropdownClosed();
		isOpen && inputRef && inputRef.current.focus();
	}, [isOpen]);

	return (
		<div ref={wrapperRef}>
			<div ref={ComboBoxRef} className="comboBox" onClick={() => {}}>
				<input
					ref={inputRef}
					onChange={onInputChange}
					value={inputValue ? inputValue : ''}
					className="comboBox__input"
					placeholder="Enter currency..."
					onFocus={(e) => {
						setIsOpen(true);
					}}
				></input>
				<button className='comboButton' 
					onClick={() => {
						setIsOpen((prev) => !prev);
					}}
				>
					<FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown}/>
				</button>
			</div>
			{isOpen && (
				<div ref={DropdownRef} className="dropDown">
					{dataSource.length > 0 ?
						dataSource.map((x, i) => {
							return (
								<div
									key={i}
									className={`dropDown__listItem ${x === selectedValue ? 'active' : ''}`}
									onClick={(e) => {
										onItemClick(e, x);
										setIsOpen(false);
									}}
								>
									{listItemRender(x)}
								</div>
							);
						}) : <p>No currencies found</p> }
				</div>
			)}
		</div>
	);
}
