import React from 'react'
import SectionTitle from './SectionTitle'

const SectionList = ({ children, title, entry, hideMobileTitle }) => {
	return (
		<div className="py-content">
			<SectionTitle title={title} entry={entry} hideMobile={hideMobileTitle} />
			<div className="mt-8">
				{children}
			</div>
		</div>
	)
}

export default SectionList