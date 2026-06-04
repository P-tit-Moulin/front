<template>
  <VContainer class="py-8">
    <VCard elevation="2" class="pa-6 max-w-xl mx-auto">
      <VCardTitle class="text-h5">Contactez-nous</VCardTitle>

      <VCardText>
        <p>
          Vous rencontrez un problème, un bug ou un dysfonctionnement sur
          l’application ? N’hésitez pas à nous contacter afin que nous puissions
          le corriger rapidement. Vous pouvez également nous écrire pour toute
          question, suggestion ou demande particulière. Cliquez directement sur
          le bouton “Envoyer un email” pour nous écrire.
        </p>
        <SecondaryButton
          variant="outlined"
          :href="`mailto:${email}?subject=Demande%20d'informations`"
          class="mt-4"
        >
          Envoyer un email
        </SecondaryButton>
      </VCardText>
    </VCard>
  </VContainer>
</template>

<script setup>
const email = 'support.p-tit-moulin@gmail.com'
</script>
