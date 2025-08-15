'use client';

import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  ArrowBack,
  ExpandMore,
  EmojiEvents,
  Schedule,
  CheckCircle,
  Cancel,
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { AuthService } from '@/lib/auth';
import { supabase, Game, GameData, Player } from '@/lib/supabase';

interface GameWithDetails extends Game {
  players?: Player[];
}

export default function GamesPage() {
  const [games, setGames] = useState<GameWithDetails[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      router.push('/login');
      return;
    }

    fetchData();
  }, [router]);

  const fetchData = async () => {
    try {
      // Fetch games and players
      const [gamesResponse, playersResponse] = await Promise.all([
        supabase.from('games').select('*').order('created_at', { ascending: false }),
        supabase.from('players').select('*')
      ]);

      if (gamesResponse.error) {
        console.error('Error fetching games:', gamesResponse.error);
      } else {
        setGames(gamesResponse.data || []);
      }

      if (playersResponse.error) {
        console.error('Error fetching players:', playersResponse.error);
      } else {
        setPlayers(playersResponse.data || []);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPlayerName = (playerId: string) => {
    const player = players.find(p => p.player_id === playerId);
    return player?.player_name || 'Unknown Player';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPositionColor = (position: number) => {
    if (position === 1) return 'gold';
    if (position === 2) return 'silver';
    if (position === 3) return '#CD7F32'; // bronze
    return 'default';
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit"
            onClick={handleBack}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Games History
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h5" gutterBottom>
          Poker Games ({games.length})
        </Typography>

        {loading ? (
          <Typography>Loading games...</Typography>
        ) : (
          <Box>
            {games.map((game) => (
              <Accordion key={game.game_id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMore />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="h6">
                        Game {game.game_id.slice(-8)}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        <Schedule sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                        {formatDate(game.created_at)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Chip
                        icon={game.ended ? <CheckCircle /> : <Cancel />}
                        label={game.ended ? 'Completed' : 'In Progress'}
                        color={game.ended ? 'success' : 'warning'}
                        size="small"
                      />
                      <Typography variant="body2" color="text.secondary">
                        {game.gamedata.length} players
                      </Typography>
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Position</TableCell>
                          <TableCell>Player</TableCell>
                          <TableCell align="center">Knockouts</TableCell>
                          <TableCell align="center">Rebuys</TableCell>
                          <TableCell align="center">Add-on</TableCell>
                          <TableCell align="center">Paid</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {game.gamedata
                          .sort((a, b) => a.left_pos - b.left_pos)
                          .map((data) => (
                          <TableRow key={data.data_id}>
                            <TableCell>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                {data.left_pos <= 3 && (
                                  <EmojiEvents 
                                    sx={{ 
                                      color: getPositionColor(data.left_pos),
                                      mr: 1,
                                      fontSize: 20
                                    }} 
                                  />
                                )}
                                <Typography variant="body2" fontWeight="bold">
                                  #{data.left_pos}
                                </Typography>
                              </Box>
                            </TableCell>
                            <TableCell>
                              <Typography variant="body2">
                                {getPlayerName(data.player_id)}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={data.knockouts} 
                                size="small" 
                                color={data.knockouts > 0 ? 'primary' : 'default'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Typography variant="body2">
                                {data.rebuys}
                              </Typography>
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={data.addon ? 'Yes' : 'No'} 
                                size="small"
                                color={data.addon ? 'success' : 'default'}
                              />
                            </TableCell>
                            <TableCell align="center">
                              <Chip 
                                label={data.payed ? 'Paid' : 'Pending'} 
                                size="small"
                                color={data.payed ? 'success' : 'warning'}
                              />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}

        {!loading && games.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h6" color="text.secondary">
              No games found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Games will appear here once they are created
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
}