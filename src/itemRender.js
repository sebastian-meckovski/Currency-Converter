const listItemRender = (item) => {
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

export default listItemRender;
