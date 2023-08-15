import { Button, Card, Stack, Typography } from "@mui/material";
import LightMode from '@mui/icons-material/LightMode';

export default function UpgradeCard({
  energy,
  setEnergy,
  upgrades,
  setUpgrades,
  upgrade_name,
  max_level,
  cost,
  button_title,
  description,
}) {


  const handleClick = () => {
    if (energy >= cost) {
      if (upgrades[upgrade_name] < max_level) {
        setEnergy(energy - cost);
        setUpgrades({...upgrades, [upgrade_name]: upgrades[upgrade_name] + 1,});
      }
    }
  }

  return (
    <Card sx={{width:1, height:'10vh', px:'10px'}}>
      <Stack direction='row' justifyContent='space-between' spacing={2} sx={{height: 1}}>
        <Stack alignItems='flex-start' justifyContent='space-evenly' sx={{height: 1}}>
          <Typography variant='h5'>{button_title} {upgrades[upgrade_name]}</Typography>
          <Typography variant='subtitle1' color='textSecondary'>{description}</Typography>
        </Stack>
        <Button variant='outlined' color='error' sx={{height:0.8, width:'160px'}} disableRipple onClick={handleClick} disabled={cost>energy | upgrades[upgrade_name] >= max_level}>
          {upgrades[upgrade_name] < max_level ? 
          <Stack direction='row' sx={{height: 1}}><Typography variant='subtitle1' sx={{marginRight:'5px'}}>{"Buy: " + Math.round(cost).toLocaleString()}</Typography> <LightMode/></Stack> : 
          <Typography variant='subtitle1'>Max Level</Typography>}
        </Button>
      </Stack>
    </Card>
  );
}
