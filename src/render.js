/**
 * Componente para renderizar o bloco.
 * É aplicado em dois locais diferentes em edit.js e um em save.js
 *
 * @param {boolean} preview Determina se está em modo preview (bloco isSelected), para renderizar diferente, se necessário
 * @return {JSX.Element} Renderização do bloco
 */
import { Fragment } from 'react';

export default function Render({ attributes }) {
	const { orientation, size, items, icon, targetBlank } = attributes;

	/**
	 * Lista array com os items após o parse.
	 *
	 * @type {{text: string, link: string}[]}
	 */
	const itemsList = JSON.parse(items);

	/**
	 * Renderiza a lista
	 *
	 * @return {JSX.Element[]} Lista
	 */
	function List() {
		const list = [];

		itemsList.forEach(({ text, link, children }) => {
			const useExpansion = children.length > 0;

			function textOrLink(textString, linkString) {
				const validLink =
					typeof linkString === 'string' && linkString.length > 0;

				if (validLink) {
					linkString = linkString.toLowerCase();
					linkString = linkString.startsWith('http')
						? linkString
						: `//${linkString}`;
				}

				return validLink ? (
					<a
						href={linkString}
						target={targetBlank ? '_blank' : '_self'}
						rel="noopener noreferrer"
					>
						{textString}
					</a>
				) : (
					textString
				);
			}

			function RenderChildren() {
				const childrenList = [];

				children.forEach((child) => {
					childrenList.push(
						<div
							className="br-item align-items-center"
							role="listitem"
						>
							{textOrLink(child.text, child.link)}
						</div>
					);
				});

				return (
					<div className="br-list" role="list">
						{childrenList}
					</div>
				);
			}

			list.push(
				<Fragment>
					<div
						className={`align-items-center br-item ${size}`}
						role="listitem"
					>
						<div className="row align-items-center">
							{icon.length >= 0 && (
								<div className="col-auto">
									<i className={icon} />
								</div>
							)}

							<div className="col">{textOrLink(text, link)}</div>

							{useExpansion && (
								<div className="col-auto">
									<button
										className="br-button circle"
										type="button"
									>
										<i
											className="fas fa-angle-down"
											aria-hidden="true"
										/>
									</button>
								</div>
							)}
						</div>

						{useExpansion && <RenderChildren />}
					</div>
				</Fragment>
			);
		});

		return list;
	}

	return (
		<div className={`br-list ${orientation}`} data-toggle>
			<List />
		</div>
	);
}
