export type PoolType = {
	pool_addr: string;
	pool_type: string;
	coin_x_type?: string;
	coin_y_type?: string;
};

export type PoolInfo = {
	object_id: string;
	global: string;
	coin_x: number;
	coin_y: number;
	fee_coin_y: number;
	fee_coin_x: number;
	lp_type: string;
	lp_supply: bigint;
};
