export const listItemRender = (item) => {
	let style = { textOverflow: 'ellipsis', whiteSpace: 'nowrap', overflow: 'hidden', fontSize: '11px', marginTop: '2px' };
	let src = item.currency.slice(0, 2).toLowerCase();
	return (
		<div key={item.currency} style={{ display: 'flex', alignItems: 'center', width: '100%', margin: '0.75rem 0.25rem' }}>
			<img src={`https://flagcdn.com/${src}.svg`} width="48" height="32" alt="" style={{ margin: '0 0.5rem' }}></img>
			<p>{item.currency}/</p>
			<p style={style}>{item.name}</p>
		</div>
	);
};

export const calculateRate = (x, y) => {
	if (isValidNumber(y) && isValidNumber(x)) {
		let result = x * y;
		let number = decimalPlaces(parseFloat(result.toFixed(2)));
		let formattedResult = result.toFixed(number);
		return formattedResult;
	}
};

export const isValidNumber = (str) => {
	if (!str) return false;
	const pattern = /^\d+(\.\d+)?$/;
	return pattern.test(str);
};

function decimalPlaces(num) {
	if (typeof num !== 'number') return false;
	const parts = num.toString().split('.');
	if (parts.length === 1) return 0;
	if (parts[1] === '00') return 0;
	return parts[1].length;
}
