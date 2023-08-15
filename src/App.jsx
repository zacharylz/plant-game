import React, { useState, useEffect } from "react";
import { Button, Box, Card, Stack, Typography, Modal, ThemeProvider, CssBaseline } from "@mui/material";
import LightMode from '@mui/icons-material/LightMode';
import MenuBook from '@mui/icons-material/MenuBook';
import theme from "./theme";
import UpgradeCard from "./components/UpgradeCard";

const App = () => {

  const [energy, setEnergy] = useState(15);
  const [upgrades, setUpgrades] = useState({
    grow_leaves: 0,
    bigger_leaves: 0,
    more_leaves: 0,
    grow_roots: 0,
    max_energy: 0,
    pest_prod: 0,
    grow_taller: 0,
  });
  const [generation, setGeneration] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);

  let energyGain = upgrades.grow_leaves * (1.5 ** upgrades.bigger_leaves) * (2 ** upgrades.more_leaves) * (1.1 ** (generation-1));
  let maxEnergy = 10 ** (3 + upgrades.max_energy);
  let pestLossRatio = Math.min(0.9,( 1 / (1+Math.E ** (-(energyGain-1500)/1000)))/ (2**upgrades.pest_prod) );
  let maxEnergyGain = 6000 * (3 ** upgrades.grow_taller);
  let netEnergyGain = (energyGain > 50 ? Math.min(energyGain,maxEnergyGain) * (1-pestLossRatio) : energyGain);

  useEffect(() => {
    const interval = setInterval(() => {
      setEnergy((energy + netEnergyGain > maxEnergy ? maxEnergy : energy + (netEnergyGain * 200/1000)));
    }, 200);

    return () => {
      clearInterval(interval);
    };
  });

  const newGeneration = () => {
    setUpgrades({
    grow_leaves: 0,
    bigger_leaves: 0,
    more_leaves: 0,
    grow_roots: 0,
    max_energy: 0,
    pest_prod: 0,
    grow_taller: 0,
    });
    setEnergy(15);
    setGeneration(generation + 1);
    setModalOpen(true);
  }
  
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Stack direction='row' sx={{height: '100vh', width:'100vw'}}>
        {/* Energy and Stats Column */}
        <Stack justifyContent='flex-start' spacing={4} sx={{width:0.2, height:1, py:4}}>
          {/* Energy Card */}
          <Card sx={{width:0.9, py:3}}>
            <Stack justifyContent='center' spacing={5} sx={{width:1, height:1}}>
              <Stack direction='row'><Typography variant='h4' sx={{marginRight:1.5}}>Energy</Typography><LightMode fontSize="large"/></Stack>
              <Stack> 
                <Typography variant='h5' gutterBottom='true'>Current:</Typography>
                <Typography variant='h5'>{Math.round(energy).toLocaleString()} / {maxEnergy.toLocaleString()}</Typography>
              </Stack>
              <Stack>
                <Typography variant='h5' gutterBottom='true'>Gain:</Typography>
                <Typography variant='h5' gutterBottom='true'>+ {Math.round(netEnergyGain).toLocaleString()} / second</Typography>
                {(energyGain > 50 ? <Typography variant='h6' sx={{color:'orange'}}>- {Math.round(pestLossRatio*100)}% due to pests</Typography> : <Typography  variant='h6'><br/></ Typography>)}
                {(energyGain > maxEnergyGain ? <Typography variant='h6' sx={{color:'orange'}}>Capped by height</Typography> : <Typography  variant='h6'><br/></Typography>)}
              </Stack>
            </Stack>
          </Card>
          {/* Stats Card */}
          <Card sx={{width:0.9, py:3}}>
            <Stack justifyContent='center' spacing={2} sx={{width:1, height:1}}>
              <Stack direction='row' sx={{height:'30px'}}><Typography variant='h4' sx={{marginRight:2}}>Stats</Typography><MenuBook fontSize="large"/></Stack><br/>
              <Typography variant='h6'>Leaves:   {upgrades.grow_leaves * (2 ** upgrades.more_leaves)}</Typography>
              <Typography variant='h6'>Height:   {Math.round((1 + upgrades.grow_leaves + (3 * upgrades.bigger_leaves) + (5 * upgrades.more_leaves)) * (1.2 **upgrades.grow_taller))} cm</Typography>
              {(energyGain > 50 | generation > 1 ? <Typography variant='h6'>Pests:   {Math.round((pestLossRatio*energyGain) ** 0.5)}</Typography> : <Typography variant='h6'><br/></Typography>)}
              {(generation > 1 ? <Typography variant='h6'>Generation:   {generation}</Typography> : <Typography variant='h6'><br/></Typography>)}            
            </Stack>            
          </Card>
        </Stack>
        {/* Main Game Column */}
        <Stack spacing={3} alignItems='flex-start' sx={{width:0.5, height:1}}>
          {/* Maturity Stack */}
          <Stack direction='row' justifyContent='flex-end' sx={{ width:1}}>
            <Typography variant='h4' sx={{color:'#b71c1c'}}>Maturity  </Typography>
            <Stack alignItems='flex-start' spacing={1} sx={{ border:1, borderColor:'#b71c1c', borderRadius:1, width:0.8, p:'10px'}}>
              {energyGain > 50 ? 
              <UpgradeCard
                energy={energy}
                setEnergy={setEnergy}
                upgrades={upgrades}
                setUpgrades={setUpgrades}
                upgrade_name="pest_prod"
                max_level={4}
                cost={3000*(3 ** upgrades.pest_prod)}
                button_title="Pesticide Production"
                description="Reduce energy lost to pests"
              /> :
              <Box sx={{height:'10vh'}}></Box>}
              {energyGain > 6000 ?
                <UpgradeCard
                energy={energy}
                setEnergy={setEnergy}
                upgrades={upgrades}
                setUpgrades={setUpgrades}
                upgrade_name="grow_taller"
                max_level={3}
                cost={20000*(3 ** upgrades.grow_taller)}
                button_title="Grow Taller"
                description="Increase max energy gain"
              />:
              <Box sx={{height:'10vh'}}></Box>}
            </Stack>
          </Stack>
          {/* Leaves Stack */}
          <Stack direction='row' justifyContent='flex-end' sx={{ width:1}}>
            <Typography variant='h4' sx={{color:'#1b5e20'}}>Leaves  </Typography>
            <Stack alignItems='flex-start' spacing={1} sx={{ border:1, borderColor:'#1b5e20', borderRadius:1, width:0.8, p:'10px'}}>
              <UpgradeCard
                 energy={energy}
                 setEnergy={setEnergy}
                 upgrades={upgrades}
                 setUpgrades={setUpgrades}
                 upgrade_name="grow_leaves"
                 max_level={40}
                 cost={5 * ((2 ** (1/(1+upgrades.grow_roots/2))) ** upgrades.grow_leaves)}
                 button_title="Grow Leaves"
                 description="Leaves automatically produce energy"
              />
              <UpgradeCard
                 energy={energy}
                 setEnergy={setEnergy}
                 upgrades={upgrades}
                 setUpgrades={setUpgrades}
                 upgrade_name="bigger_leaves"
                 max_level={10}
                 cost={20 ** (1+upgrades.bigger_leaves/3)}
                 button_title="Bigger Leaves"
                 description="Each leaf produces 50% more energy"
              />
              {energyGain > 4 ?
                <UpgradeCard
                 energy={energy}
                 setEnergy={setEnergy}
                 upgrades={upgrades}
                 setUpgrades={setUpgrades}
                 upgrade_name="more_leaves"
                 max_level={6}
                 cost={50 * (10 ** (upgrades.more_leaves/1.6))}
                 button_title="More Leaves"
                 description="Doubles current leaves and leaf gain"
              />:
              <Box sx={{height:'10vh'}}></Box>}
            </Stack>          
          </Stack>
          {/* Roots Stack */}
          <Stack direction='row' justifyContent='flex-end' sx={{ width:1}}>
            <Typography variant='h4' sx={{color:'#5d4037'}}>Roots  </Typography>
            <Stack alignItems='flex-start' spacing={1} sx={{ border:1, borderColor:'#5d4037', borderRadius:1, width:0.8, p:'10px'}}>
              {energyGain > 10 ?
                <UpgradeCard
                energy={energy}
                setEnergy={setEnergy}
                upgrades={upgrades}
                setUpgrades={setUpgrades}
                upgrade_name="grow_roots"
                max_level={4}
                cost={10 ** (2+upgrades.grow_roots)}
                button_title="Grow Roots"
                description="Growing leaves costs less energy"
              />:
              <Box sx={{height:'10vh'}}></Box>}
              {energyGain > 80 ?
                <UpgradeCard
                energy={energy}
                setEnergy={setEnergy}
                upgrades={upgrades}
                setUpgrades={setUpgrades}
                upgrade_name="max_energy"
                max_level={4}
                cost={800 * (10 ** upgrades.max_energy)}
                button_title="Max Energy"
                description="Increase max energy"
              />:
              <Box sx={{height:'10vh'}}></Box>}
            </Stack>
          </Stack>
        </Stack>
        {/* Text Column */}
        <Stack justifyContent='flex-start' alignItems='flex-start' sx={{width:0.30, height:1, p:8}}>
          <Typography variant='body1' color={energyGain>50 && 'grey.700'}>You push out of the soil and reach towards the light.<br/>Time to grow.<br/><br/><br/></Typography>
          {energyGain>50 && <Typography variant='body1' color={energyGain>6000 && 'grey.700'}>Jaws bite and tear at your leaves.<br/>You begin to produce poison to ward them off.<br/><br/><br/></Typography>}
          {energyGain>6000 && <Typography variant='body1' color={maxEnergy>2000000 && 'grey.700'}>Others encroach on your space and threaten to block out the light.<br/>You grow up past the canopy above you.<br/><br/><br/></Typography>}
          {maxEnergy>2000000 && <Typography variant='body1' >You have grown to your limits. All that remains is to gather enough energy for the next stage.<br/><br/></Typography>}
          {maxEnergy>2000000 && <Card sx={{width:1, height:'10vh', px:'15px', border:1, borderColor:'#ffed2a'}}>
            <Stack direction='row' justifyContent='space-between' sx={{height:1}}>
              <Typography variant='h5'>Grow Fruit</Typography>
              <Button variant='outlined' color='error' sx={{height:0.8, width:'170px'}} onClick={newGeneration} disableRipple disabled={2000000>energy}>
                <Stack direction='row' sx={{height: 1}}><Typography variant='subtitle1' sx={{marginRight:'5px'}}>{"Buy: " + Math.round(2000000).toLocaleString()}</Typography> <LightMode/></Stack>
              </Button>              
            </Stack>
          </Card>}
          {/* Modal */}
          <Modal open={modalOpen}>
            <Card sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              height:'50vh', 
              width:'40vw',
              p:4
              }}>
              <Stack sx={{width:1, height:1}}>
                <Typography variant='body1'>You fall through the leaves and land in the dirt.</Typography>
                <Typography variant='body1'>You lie dormant and wait for the right time to grow.<br/><br/></Typography>
                <Typography variant='h5'>Thank you for playing!<br/><br/></Typography>
                <Button variant='contained' color='primary' sx={{mb:2}} onClick={() => setModalOpen(false)}>CONTINUE</Button>
                <Typography variant='body1' sx={{fontStyle:'normal'}}>(Start over with 10% faster energy gain)</Typography>
              </Stack>
              
            </Card>
          </Modal>
        </Stack>
      </Stack>

    </ThemeProvider>
  );
} 

export default App;
