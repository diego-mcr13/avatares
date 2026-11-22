# Genera las voces de ejemplo (voz sintética de Windows, en español) a partir de un JSON.
# Lo llama scripts/voces_ejemplo.py; no hace falta correrlo a mano.
param([string]$Entrada)
Add-Type -AssemblyName System.Speech
$items = Get-Content -Raw -Encoding UTF8 $Entrada | ConvertFrom-Json
$voz = New-Object System.Speech.Synthesis.SpeechSynthesizer
$helena = $voz.GetInstalledVoices() | Where-Object { $_.VoiceInfo.Culture.Name -like 'es*' } | Select-Object -First 1
if (-not $helena) { Write-Error 'No hay una voz en español instalada en Windows'; exit 1 }
$voz.SelectVoice($helena.VoiceInfo.Name)
foreach ($it in $items) {
  $texto = [System.Security.SecurityElement]::Escape($it.texto)
  $ssml = "<speak version='1.0' xml:lang='es-ES' xmlns='http://www.w3.org/2001/10/synthesis'><prosody pitch='$($it.pitch)' rate='$($it.rate)'>$texto</prosody></speak>"
  $voz.SetOutputToWaveFile($it.salida)
  $voz.SpeakSsml($ssml)
  $voz.SetOutputToNull()
}
$voz.Dispose()
