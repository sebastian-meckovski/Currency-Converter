import { useRef, useState, useLayoutEffect, useEffect } from 'react';
import './comboBox.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp, faSpinner } from '@fortawesome/free-solid-svg-icons';

export function ComboBox({ dataSource, listItemRender, onItemClick, inputValue, onInputChange, onDropdownClosed, selectedValue, isLoading }) {
	const [isOpen, setIsOpen] = useState(false);
	const ComboBoxRef = useRef(null);
	const wrapperRef = useRef(null);
	const DropdownRef = useRef(null);
	const inputRef = useRef(null);
	const [index, setIndex] = useState(-2);

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
		setIndex(-2)
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isOpen]);

	useEffect(() => {
		let listitem;
		if (DropdownRef.current) {
			listitem = DropdownRef.current.children[index];
			listitem.focus();
		}
	}, [index]);

	const onKeyDown = (e, x) => {
		switch (e.key) {
			case 'ArrowDown':
				setIndex((prev) => (dataSource && prev < dataSource.length - 1 ? prev + 1 : prev));
				break;
			case 'ArrowUp':
				setIndex((prev) => (prev > 0 ? prev - 1 : prev));
				break;
			case 'Enter':
				handleClick(e, x);
				break;
			case 'Tab':
				setIsOpen(false);
				break;
			default:
		}
	};

	const handleClick = (e, x) => {
		onItemClick(e, x);
		setIsOpen(false);
	};

	return (
		<div className="comboBoxWrapper" ref={wrapperRef}>
			<div ref={ComboBoxRef} className={`comboBox ${isOpen ? 'open' : ''}`} onKeyDown={onKeyDown}>
				{isOpen ? (
					<input
						onKeyDown={onKeyDown}
						ref={inputRef}
						onChange={onInputChange}
						value={inputValue ? inputValue : ''}
						className="comboBox__input"
						placeholder="Enter currency..."
						onFocus={(e) => {
							setIsOpen(true);
						}}
					></input>
				) : (
					
					<div
						style={{ width: '100%' }}
						onClick={() => {
							setIsOpen(true);
						}}
					>hello
						{selectedValue && listItemRender(selectedValue)}
					</div>
				)}
				<button
					className="comboButton"
					onClick={() => {
						setIsOpen((prev) => !prev);
					}}
				>
					{!isLoading ? <FontAwesomeIcon icon={isOpen ? faAngleUp : faAngleDown} /> : <FontAwesomeIcon className='spinner' icon={faSpinner} />}
				</button>
			</div>
			{isOpen && (
				<div ref={DropdownRef} className={`dropDown`}>
					{dataSource.length > 0 ? (
						dataSource.map((x, i) => {
							return (
								<div
									onKeyDown={(e) => {
										onKeyDown(e, x);
									}}
									key={i}
									tabIndex={i}
									className={`dropDown__listItem ${x === selectedValue ? 'active' : ''}`}
									onClick={(e) => {
										handleClick(e, x);
									}}
								>
									{listItemRender(x)}
								</div>
							);
						})
					) : (
						<p>No currencies found</p>
					)}
				</div>
			)}
		</div>
	);
}
