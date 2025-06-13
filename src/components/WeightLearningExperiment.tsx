import React, { useState, useEffect, type ChangeEvent } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { css } from 'styled-system/css'

// TypeScript接口定义
interface Parameters {
	x1: number;
	x2: number;
	t: number;
	w1: number;
	w2: number;
	alpha: number;
	iterations: number;
	method: 'relu' | 'weight';
}

interface ResultData {
	iteration: number;
	y: number;
	error: number;
	w1: number;
	w2: number;
	convergence: number;
}

interface AlphaComparison {
	alpha: number;
	finalError: number;
	converged: boolean;
	oscillated: boolean;
}

type LearningMethod = (params: Parameters) => ResultData[];

// Panda CSS样式定义
const styles = {
	container: css({
		maxWidth: '6xl',
		margin: '0 auto',
		padding: '1.5rem',
		backgroundColor: 'white',
		minHeight: '100vh',
		color: 'gray.950',
	}),

	header: css({
		marginBottom: '2rem'
	}),

	title: css({
		fontSize: '1.875rem',
		fontWeight: 'bold',
		color: 'gray.800',
		marginBottom: '1rem'
	}),

	subtitle: css({
		color: 'gray.600',
		marginBottom: '1.5rem'
	}),

	parameterSection: css({
		background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
		padding: '1.5rem',
		borderRadius: '1rem',
		marginBottom: '2rem',
		boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		border: '1px solid #e5e7eb'
	}),

	sectionTitle: css({
		fontSize: '1.25rem',
		fontWeight: '600',
		marginBottom: '1rem',
		color: 'gray.950',
		display: 'flex',
		alignItems: 'center'
	}),

	sectionDot: css({
		width: '0.5rem',
		height: '0.5rem',
		borderRadius: '50%',
		marginRight: '0.75rem'
	}),

	blueDot: css({
		backgroundColor: '#3b82f6'
	}),

	greenDot: css({
		backgroundColor: '#10b981'
	}),

	purpleDot: css({
		backgroundColor: '#8b5cf6'
	}),

	indigoDot: css({
		backgroundColor: '#6366f1'
	}),

	parameterGrid: css({
		display: 'grid',
		gridTemplateColumns: 'repeat(2, 1fr)',
		gap: '1rem',
		'@media (min-width: 768px)': {
			gridTemplateColumns: 'repeat(4, 1fr)'
		}
	}),

	inputGroup: css({
		display: 'flex',
		flexDirection: 'column',
		gap: '0.5rem'
	}),

	label: css({
		display: 'block',
		fontSize: '0.875rem',
		fontWeight: '500',
		color: 'gray.800'
	}),

	input: css({
		width: '100%',
		padding: '0.75rem',
		border: '1px solid #d1d5db',
		borderRadius: '0.5rem',
		outline: 'none',
		backgroundColor: 'white',
		boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		transition: 'all 0.2s ease-in-out',
		'&:focus': {
			ring: '2px',
			ringColor: '#3b82f6',
			borderColor: 'transparent'
		}
	}),

	select: css({
		width: '100%',
		padding: '0.75rem',
		border: '1px solid #d1d5db',
		borderRadius: '0.5rem',
		outline: 'none',
		backgroundColor: 'white',
		boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		transition: 'all 0.2s ease-in-out',
		'&:focus': {
			ring: '2px',
			ringColor: '#3b82f6',
			borderColor: 'transparent'
		}
	}),

	chartSection: css({
		backgroundColor: 'white',
		padding: '1.5rem',
		borderRadius: '1rem',
		marginBottom: '2rem',
		boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		border: '1px solid #e5e7eb'
	}),

	chartContainer: css({
		backgroundColor: '#f9fafb',
		padding: '1rem',
		borderRadius: '0.75rem'
	}),

	table: css({
		minWidth: '100%'
	}),

	tableHeader: css({
		backgroundColor: 'white',
		boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)'
	}),

	tableHeaderCell: css({
		padding: '0.75rem 1.5rem',
		textAlign: 'left',
		fontSize: '0.875rem',
		fontWeight: '600',
		color: 'gray.700'
	}),

	tableHeaderCellFirst: css({
		borderTopLeftRadius: '0.5rem',
		borderBottomLeftRadius: '0.5rem'
	}),

	tableHeaderCellLast: css({
		borderTopRightRadius: '0.5rem',
		borderBottomRightRadius: '0.5rem'
	}),

	tableRow: css({
		backgroundColor: 'white',
		boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		transition: 'background-color 0.15s ease-in-out',
		'&:hover': {
			backgroundColor: '#f9fafb'
		}
	}),

	tableCell: css({
		padding: '0.75rem 1.5rem',
		fontSize: '0.875rem',
		color: 'gray.900'
	}),

	tableCellFirst: css({
		borderTopLeftRadius: '0.5rem',
		borderBottomLeftRadius: '0.5rem',
		fontWeight: '500'
	}),

	tableCellLast: css({
		borderTopRightRadius: '0.5rem',
		borderBottomRightRadius: '0.5rem'
	}),

	badge: css({
		display: 'inline-flex',
		paddingX: '0.75rem',
		paddingY: '0.25rem',
		borderRadius: '9999px',
		fontSize: '0.75rem',
		fontWeight: '500'
	}),

	badgeSuccess: css({
		backgroundColor: '#dcfce7',
		color: '#166534',
		border: '1px solid #bbf7d0'
	}),

	badgeError: css({
		backgroundColor: '#fef2f2',
		color: '#991b1b',
		border: '1px solid #fecaca'
	}),

	badgeWarning: css({
		backgroundColor: '#fefce8',
		color: '#a16207',
		border: '1px solid #fef08a'
	}),

	badgeInfo: css({
		backgroundColor: '#dbeafe',
		color: '#1e40af',
		border: '1px solid #bfdbfe'
	}),

	tableContainer: css({
		overflowX: 'auto',
		backgroundColor: '#f9fafb',
		borderRadius: '0.75rem',
		padding: '1rem'
	}),

	conclusionSection: css({
		background: 'linear-gradient(135deg, #eff6ff 0%, #e0e7ff 100%)',
		padding: '2rem',
		borderRadius: '1rem',
		boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
		border: '1px solid #bfdbfe'
	}),

	conclusionTitle: css({
		fontSize: '1.5rem',
		fontWeight: 'bold',
		marginBottom: '1.5rem',
		color: '#1e3a8a',
		display: 'flex',
		alignItems: 'center'
	}),

	conclusionDot: css({
		backgroundColor: '#2563eb',
		width: '0.75rem',
		height: '0.75rem',
		borderRadius: '50%',
		marginRight: '0.75rem'
	}),

	conclusionContent: css({
		display: 'flex',
		flexDirection: 'column',
		gap: '1.5rem',
		color: 'gray.700'
	}),

	conclusionCard: css({
		backgroundColor: 'white',
		padding: '1.5rem',
		borderRadius: '0.75rem',
		boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
		border: '1px solid #dbeafe'
	}),

	conclusionCardTitle: css({
		fontWeight: 'bold',
		color: '#1e40af',
		marginBottom: '0.75rem',
		fontSize: '1.125rem'
	}),

	conclusionList: css({
		display: 'flex',
		flexDirection: 'column',
		gap: '0.5rem',
		marginLeft: '1rem'
	}),

	conclusionListItem: css({
		display: 'flex',
		alignItems: 'flex-start'
	}),

	listDot: css({
		width: '0.375rem',
		height: '0.375rem',
		borderRadius: '50%',
		marginTop: '0.5rem',
		marginRight: '0.75rem',
		flexShrink: 0
	}),

	blueDotSmall: css({
		backgroundColor: '#3b82f6'
	}),

	redDotSmall: css({
		backgroundColor: '#ef4444'
	}),

	greenDotSmall: css({
		backgroundColor: '#10b981'
	}),

	yellowDotSmall: css({
		backgroundColor: '#f59e0b'
	}),

	purpleDotSmall: css({
		backgroundColor: '#8b5cf6'
	}),

	limitMessage: css({
		fontSize: '0.875rem',
		color: 'gray.500',
		marginTop: '1rem',
		textAlign: 'center',
		backgroundColor: '#f9fafb',
		padding: '0.5rem',
		borderRadius: '0.5rem'
	})
} as const;

const WeightLearningExperiment: React.FC = () => {
	const [results, setResults] = useState<ResultData[]>([]);
	const [parameters, setParameters] = useState<Parameters>({
		x1: 5,
		x2: 3,
		t: 10,
		w1: 4,
		w2: 6,
		alpha: 0.01,
		iterations: 15,
		method: 'relu'
	});

	// ReLU方式: w = w + α * x * E
	const runReLUMethod: LearningMethod = (params: Parameters): ResultData[] => {
		let { x1, x2, t, w1, w2, alpha, iterations } = params;
		const data: ResultData[] = [];

		for (let i = 0; i < iterations; i++) {
			const y: number = x1 * w1 + x2 * w2;
			const e: number = t - y;
			const e1: number = alpha * x1 * e;
			const e2: number = alpha * x2 * e;

			data.push({
				iteration: i,
				y: parseFloat(y.toFixed(3)),
				error: parseFloat(e.toFixed(3)),
				w1: parseFloat(w1.toFixed(3)),
				w2: parseFloat(w2.toFixed(3)),
				convergence: Math.abs(e)
			});

			w1 = w1 + e1;
			w2 = w2 + e2;
		}

		return data;
	};

	// 重み方式: w = w + α * w * E
	const runWeightMethod: LearningMethod = (params: Parameters): ResultData[] => {
		let { x1, x2, t, w1, w2, alpha, iterations } = params;
		const data: ResultData[] = [];

		for (let i = 0; i < iterations; i++) {
			const y: number = x1 * w1 + x2 * w2;
			const e: number = t - y;
			const e1: number = alpha * w1 * e;
			const e2: number = alpha * w2 * e;

			data.push({
				iteration: i,
				y: parseFloat(y.toFixed(3)),
				error: parseFloat(e.toFixed(3)),
				w1: parseFloat(w1.toFixed(3)),
				w2: parseFloat(w2.toFixed(3)),
				convergence: Math.abs(e)
			});

			w1 = w1 + e1;
			w2 = w2 + e2;
		}

		return data;
	};

	const runExperiment = (): void => {
		const method: LearningMethod = parameters.method === 'relu' ? runReLUMethod : runWeightMethod;
		const data: ResultData[] = method(parameters);
		setResults(data);
	};

	useEffect(() => {
		runExperiment();
	}, [parameters]);

	const handleParameterChange = (key: keyof Parameters, value: string): void => {
		setParameters(prev => ({
			...prev,
			[key]: key === 'method' ? value as 'relu' | 'weight' : parseFloat(value) || (prev[key] as number)
		}));
	};

	const handleInputChange = (key: keyof Parameters) => (e: ChangeEvent<HTMLInputElement>): void => {
		handleParameterChange(key, e.target.value);
	};

	const handleSelectChange = (key: keyof Parameters) => (e: ChangeEvent<HTMLSelectElement>): void => {
		handleParameterChange(key, e.target.value);
	};

	// 複数の学習率での比較実験
	const compareAlphaValues = (): AlphaComparison[] => {
		const alphas: number[] = [0.001, 0.01, 0.1, 0.5];
		const comparison: AlphaComparison[] = alphas.map((alpha: number) => {
			const testParams: Parameters = { ...parameters, alpha };
			const method: LearningMethod = parameters.method === 'relu' ? runReLUMethod : runWeightMethod;
			const data: ResultData[] = method(testParams);
			return {
				alpha,
				finalError: Math.abs(data[data.length - 1].error),
				converged: Math.abs(data[data.length - 1].error) < 0.1,
				oscillated: data.some((d: ResultData, i: number) => i > 0 && Math.abs(d.error) > Math.abs(data[i-1].error))
			};
		});
		return comparison;
	};

	const alphaComparison: AlphaComparison[] = compareAlphaValues();

	const getBadgeStyle = (condition: boolean, trueStyle: string, falseStyle: string): string => {
		return `${styles.badge} ${condition ? trueStyle : falseStyle}`;
	};

	return (
		<div className={styles.container}>
			<div className={styles.header}>
				<h1 className={styles.title}>
					ReLU重み学習実験レポート
				</h1>
				<p className={styles.subtitle}>
					ニューラルネットワークにおける二つの重み更新方式の比較実験
				</p>
			</div>

			{/* パラメータ設定 */}
			<div className={styles.parameterSection}>
				<h2 className={styles.sectionTitle}>
					<span className={`${styles.sectionDot} ${styles.blueDot}`}></span>
					実験パラメータ
				</h2>
				<div className={styles.parameterGrid}>
					<div className={styles.inputGroup}>
						<label className={styles.label}>x1</label>
						<input
							type="number"
							value={parameters.x1}
							onChange={handleInputChange('x1')}
							className={styles.input}
						/>
					</div>
					<div className={styles.inputGroup}>
						<label className={styles.label}>x2</label>
						<input
							type="number"
							value={parameters.x2}
							onChange={handleInputChange('x2')}
							className={styles.input}
						/>
					</div>
					<div className={styles.inputGroup}>
						<label className={styles.label}>目標値 t</label>
						<input
							type="number"
							value={parameters.t}
							onChange={handleInputChange('t')}
							className={styles.input}
						/>
					</div>
					<div className={styles.inputGroup}>
						<label className={styles.label}>学習率 α</label>
						<input
							type="number"
							step="0.001"
							value={parameters.alpha}
							onChange={handleInputChange('alpha')}
							className={styles.input}
						/>
					</div>
					<div className={styles.inputGroup}>
						<label className={styles.label}>初期w1</label>
						<input
							type="number"
							value={parameters.w1}
							onChange={handleInputChange('w1')}
							className={styles.input}
						/>
					</div>
					<div className={styles.inputGroup}>
						<label className={styles.label}>初期w2</label>
						<input
							type="number"
							value={parameters.w2}
							onChange={handleInputChange('w2')}
							className={styles.input}
						/>
					</div>
					<div className={styles.inputGroup}>
						<label className={styles.label}>反復回数</label>
						<input
							type="number"
							value={parameters.iterations}
							onChange={handleInputChange('iterations')}
							className={styles.input}
						/>
					</div>
					<div className={styles.inputGroup}>
						<label className={styles.label}>更新方式</label>
						<select
							value={parameters.method}
							onChange={handleSelectChange('method')}
							className={styles.select}
						>
							<option value="relu">ReLU方式 (α×x×E)</option>
							<option value="weight">重み方式 (α×w×E)</option>
						</select>
					</div>
				</div>
			</div>

			{/* 収束グラフ */}
			<div className={styles.chartSection}>
				<h2 className={styles.sectionTitle}>
					<span className={`${styles.sectionDot} ${styles.greenDot}`}></span>
					収束過程の可視化
				</h2>
				<div className={styles.chartContainer}>
					<ResponsiveContainer width="100%" height={400}>
						<LineChart data={results}>
							<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
							<XAxis dataKey="iteration" stroke="#6b7280" />
							<YAxis stroke="#6b7280" />
							<Tooltip
								contentStyle={{
									backgroundColor: 'white',
									border: '1px solid #e5e7eb',
									borderRadius: '8px',
									boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
								}}
							/>
							<Legend />
							<Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={2} name="出力値 y" />
							<Line type="monotone" dataKey="error" stroke="#10b981" strokeWidth={2} name="誤差 e" />
							<Line type="monotone" dataKey="convergence" stroke="#f59e0b" strokeWidth={2} name="収束度 |e|" />
						</LineChart>
					</ResponsiveContainer>
				</div>
			</div>

			{/* 学習率比較表 */}
			<div className={styles.chartSection}>
				<h2 className={styles.sectionTitle}>
					<span className={`${styles.sectionDot} ${styles.purpleDot}`}></span>
					学習率αの影響分析
				</h2>
				<div className={styles.tableContainer}>
					<table className={styles.table}>
						<thead>
						<tr className={styles.tableHeader}>
							<th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellFirst}`}>学習率 α</th>
							<th className={styles.tableHeaderCell}>最終誤差</th>
							<th className={styles.tableHeaderCell}>収束判定</th>
							<th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellLast}`}>振動有無</th>
						</tr>
						</thead>
						<tbody>
						{alphaComparison.map((result: AlphaComparison, index: number) => (
							<tr key={index} className={styles.tableRow}>
								<td className={`${styles.tableCell} ${styles.tableCellFirst}`}>{result.alpha}</td>
								<td className={styles.tableCell}>{result.finalError.toFixed(3)}</td>
								<td className={styles.tableCell}>
                    <span className={getBadgeStyle(result.converged, styles.badgeSuccess, styles.badgeError)}>
                      {result.converged ? '収束' : '未収束'}
                    </span>
								</td>
								<td className={`${styles.tableCell} ${styles.tableCellLast}`}>
                    <span className={getBadgeStyle(result.oscillated, styles.badgeWarning, styles.badgeInfo)}>
                      {result.oscillated ? '振動あり' : '安定'}
                    </span>
								</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
			</div>

			{/* 実験結果詳細 */}
			<div className={styles.chartSection}>
				<h2 className={styles.sectionTitle}>
					<span className={`${styles.sectionDot} ${styles.indigoDot}`}></span>
					実験結果詳細データ
				</h2>
				<div className={styles.tableContainer}>
					<table className={styles.table}>
						<thead>
						<tr className={styles.tableHeader}>
							<th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellFirst}`}>反復</th>
							<th className={styles.tableHeaderCell}>出力 y</th>
							<th className={styles.tableHeaderCell}>誤差 e</th>
							<th className={styles.tableHeaderCell}>重み w1</th>
							<th className={`${styles.tableHeaderCell} ${styles.tableHeaderCellLast}`}>重み w2</th>
						</tr>
						</thead>
						<tbody>
						{results.slice(0, 10).map((row: ResultData, index: number) => (
							<tr key={index} className={styles.tableRow}>
								<td className={`${styles.tableCell} ${styles.tableCellFirst}`}>{row.iteration}</td>
								<td className={styles.tableCell}>{row.y}</td>
								<td className={styles.tableCell}>{row.error}</td>
								<td className={styles.tableCell}>{row.w1}</td>
								<td className={`${styles.tableCell} ${styles.tableCellLast}`}>{row.w2}</td>
							</tr>
						))}
						</tbody>
					</table>
				</div>
				{results.length > 10 && (
					<p className={styles.limitMessage}>
						最初の10回の結果を表示（全{results.length}回）
					</p>
				)}
			</div>

			{/* 観察結果と考察 */}
			<div className={styles.conclusionSection}>
				<h2 className={styles.conclusionTitle}>
					<span className={styles.conclusionDot}></span>
					実験観察結果と考察
				</h2>
				<div className={styles.conclusionContent}>
					<div className={styles.conclusionCard}>
						<h3 className={styles.conclusionCardTitle}>1. ReLU方式 (w = w + α × x × E) の特徴</h3>
						<div className={styles.conclusionList}>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.blueDotSmall}`}></span>
								入力値xに比例した重み更新が行われる
							</div>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.blueDotSmall}`}></span>
								入力値が大きいほど重みの変化が大きくなる
							</div>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.blueDotSmall}`}></span>
								比較的安定した収束特性を示す
							</div>
						</div>
					</div>
					<div className={styles.conclusionCard}>
						<h3 className={styles.conclusionCardTitle}>2. 重み方式 (w = w + α × w × E) の特徴</h3>
						<div className={styles.conclusionList}>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.redDotSmall}`}></span>
								現在の重み値に比例した更新が行われる
							</div>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.redDotSmall}`}></span>
								重みが大きいほど変化量も大きくなる（自己増幅効果）
							</div>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.redDotSmall}`}></span>
								発散する可能性が高い
							</div>
						</div>
					</div>
					<div className={styles.conclusionCard}>
						<h3 className={styles.conclusionCardTitle}>3. 学習率αの影響</h3>
						<div className={styles.conclusionList}>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.greenDotSmall}`}></span>
								α = 0.001: 収束が遅いが安定
							</div>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.blueDotSmall}`}></span>
								α = 0.01: 適度な収束速度
							</div>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.yellowDotSmall}`}></span>
								α = 0.1以上: 振動や発散の可能性
							</div>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.redDotSmall}`}></span>
								大きすぎる学習率は学習の不安定化を招く
							</div>
						</div>
					</div>
					<div className={styles.conclusionCard}>
						<h3 className={styles.conclusionCardTitle}>4. 初期値の影響</h3>
						<div className={styles.conclusionList}>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.purpleDotSmall}`}></span>
								初期重みが大きいほど収束に時間がかかる
							</div>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.purpleDotSmall}`}></span>
								重み方式では初期値が発散リスクに直結
							</div>
							<div className={styles.conclusionListItem}>
								<span className={`${styles.listDot} ${styles.purpleDotSmall}`}></span>
								適切な初期値設定が重要
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default WeightLearningExperiment;
