<template>
  <div class="assurance-block">
    <div class="container">
        <div class="d-flex assurance-type">
            <AAssuranceDelivery />
            <AAssurancePayment />
            <AAssuranceContact />
            <AAssuranceSwap />
        </div>
    </div>
  </div>
</template>
<script>
import AAssuranceDelivery from 'theme/components/atoms/a-assurance-delivery';
import AAssurancePayment from 'theme/components/atoms/a-assurance-payment';
import AAssuranceContact from 'theme/components/atoms/a-assurance-contact';
import AAssuranceSwap from 'theme/components/atoms/a-assurance-swap';
export default
{
  components:
  {
      AAssuranceDelivery,
      AAssurancePayment,
      AAssuranceContact,
      AAssuranceSwap
  },

  data () {
    return {};
  }
};
</script>
