import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Types for our database tables
export interface Player {
  player_id: string;
  player_name: string;
  password: string;
  selected: boolean;
  avatar: string;
  email: string;
  is_admin: boolean;
}

export interface Rule {
  rule_id: string;
  active: boolean;
  pot: number;
  buyin: number;
  rebuy: number;
  addon: number;
  knockout: number;
  formula: number;
  prizes: Prize[];
  points: Point[];
}

export interface Prize {
  position: number;
  prize: number;
}

export interface Point {
  position: number;
  points: number;
}

export interface Game {
  game_id: string;
  created_at: string;
  ended: boolean;
  rule_id: string;
  gamedata: GameData[];
}

export interface GameData {
  data_id: string;
  left_pos: number;
  knockouts: number;
  rebuys: number;
  complete: boolean;
  addon: boolean;
  payed: boolean;
  debit: number;
  player_id: string;
}