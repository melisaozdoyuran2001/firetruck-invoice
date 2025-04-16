import { Document, Page, Text, View, StyleSheet, Image } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
    backgroundColor: '#ffffff',
    color: '#333333',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
    borderBottom: '2 solid #e0e0e0',
    paddingBottom: 20,
  },
  headerLogoText: {
    width: '30%',
    alignItems: 'flex-start',
  },
  logoImage: {
    width: 80,
    height: 50,
    marginBottom: 5,
  },
  headerTitleSection: {
    width: '70%',
    alignItems: 'flex-end',
  },
  documentTitle: {
    fontSize: 16,
    color: '#003366',
    marginTop: 5,
  },
  invoiceDetailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  invoiceNumberSection: {
    width: '45%',
  },
  invoiceNumber: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  invoiceDate: {
    marginTop: 5,
  },
  addressSection: {
    width: '45%',
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    marginBottom: 6,
    color: '#003366',
    textTransform: 'uppercase',
  },
  addressText: {
    marginBottom: 3,
  },
  divider: {
    borderBottom: '1 solid #e0e0e0',
    marginVertical: 15,
  },
  vehicleInfoContainer: {
    marginBottom: 20,
  },
  vehicleInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  vehicleInfoKey: {
    width: '35%',
    fontWeight: 'bold',
  },
  vehicleInfoValue: {
    width: '65%',
  },
  descriptionContainer: {
    marginBottom: 20,
  },
  descriptionText: {
    lineHeight: 1.5,
  },
  vehicleImage: {
    width: 300,
    height: 'auto',
    marginBottom: 10,
    border: '1 solid #ccc',
  },
  imageNotice: {
    fontSize: 9,
    fontStyle: 'italic',
    color: '#666666',
    marginTop: 5,
  },
  pricingContainer: {
    marginBottom: 20,
  },
  pricingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingTop: 10,
    borderTop: '1 solid #e0e0e0',
    fontWeight: 'bold',
  },
  signatureContainer: {
    marginTop: 30,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureSection: {
    width: '45%',
  },
  signatureLine: {
    borderTop: '1 solid #000000',
    marginTop: 40,
    paddingTop: 5,
    width: '90%',
  },
  termsContainer: {
    marginTop: 40,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  termsTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  termsText: {
    fontSize: 9,
    lineHeight: 1.4,
  },
  footer: {
    marginTop: 30,
    padding: '10 0',
    fontSize: 9,
    textAlign: 'center',
    color: '#777777',
    borderTop: '1 solid #e0e0e0',
  },
  watermark: {
    position: 'absolute',
    top: '50%',
    left: '30%',
    color: '#e0e0e0',
    fontSize: 60,
    opacity: 0.3,
    transform: 'rotate(-45deg)',
  },
});

export default function EnhancedInvoicePDF({ data }) {
  const invoiceNumber = `INV-${new Date().getFullYear()}-${data?.id?.substring(0, 8)?.toUpperCase() || 'TEMP'}`;
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const sellingPrice = data?.sellingPrice || 0;
  const taxRate = 0.07;
  const taxAmount = sellingPrice * taxRate;
  const totalAmount = sellingPrice + taxAmount;
  const formattedCreationDate = data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A';
  const firstImageUrl = data?.imageUrls?.[0];

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.watermark}>OFFICIAL</Text>

        <View style={styles.headerContainer}>
          <View style={styles.headerLogoText}>
            <Image src="/logo.png" style={styles.logoImage} />
          </View>
          <View style={styles.headerTitleSection}>
            <Text style={styles.documentTitle}>OFFICIAL VEHICLE INVOICE</Text>
          </View>
        </View>

        <View style={styles.invoiceDetailsContainer}>
          <View style={styles.invoiceNumberSection}>
            <Text style={styles.sectionTitle}>Invoice Information</Text>
            <Text style={styles.invoiceNumber}>Invoice #: {invoiceNumber}</Text>
            <Text style={styles.invoiceDate}>Date Issued: {today}</Text>
            <Text>Listing Created: {formattedCreationDate}</Text>
          </View>
          <View style={styles.addressSection}>
            <Text style={styles.sectionTitle}>Vendor Information</Text>
            <Text style={styles.addressText}>Contact: {data?.user?.email || 'N/A'}</Text>
            <Text style={styles.addressText}>ID: {data?.userId?.substring(0, 8) || 'N/A'}</Text>
          </View>
        </View>

        {firstImageUrl && <Image src={firstImageUrl} style={styles.vehicleImage} />}

        <View style={styles.divider} />

        <View style={styles.vehicleInfoContainer}>
          <Text style={styles.sectionTitle}>Vehicle Details</Text>

          {data?.listingTitle && (
            <View style={styles.vehicleInfoRow}>
              <Text style={styles.vehicleInfoKey}>Vehicle:</Text>
              <Text style={styles.vehicleInfoValue}>{data.listingTitle}</Text>
            </View>
          )}

          {data?.itemBrand && (
            <View style={styles.vehicleInfoRow}>
              <Text style={styles.vehicleInfoKey}>Brand:</Text>
              <Text style={styles.vehicleInfoValue}>{data.itemBrand}</Text>
            </View>
          )}

          {data?.itemAge && (
            <View style={styles.vehicleInfoRow}>
              <Text style={styles.vehicleInfoKey}>Year:</Text>
              <Text style={styles.vehicleInfoValue}>{data.itemAge}</Text>
            </View>
          )}

          {data?.mileage && (
            <View style={styles.vehicleInfoRow}>
              <Text style={styles.vehicleInfoKey}>Mileage:</Text>
              <Text style={styles.vehicleInfoValue}>
                {data.mileage.toLocaleString()} miles
              </Text>
            </View>
          )}

          {data?.tankSize && (
            <View style={styles.vehicleInfoRow}>
              <Text style={styles.vehicleInfoKey}>Tank Sizew:</Text>
              <Text style={styles.vehicleInfoValue}>
                {data.tankSize.toLocaleString()}
              </Text>
            </View>
          )}

          {data?.pumpSize && (
            <View style={styles.vehicleInfoRow}>
              <Text style={styles.vehicleInfoKey}>Pump Size:</Text>
              <Text style={styles.vehicleInfoValue}>
                {data.pumpSize.toLocaleString()} GPM
              </Text>
            </View>
          )}

          {data?.itemHeight && (
            <View style={styles.vehicleInfoRow}>
              <Text style={styles.vehicleInfoKey}>Height:</Text>
              <Text style={styles.vehicleInfoValue}>
                {data.itemHeight.toLocaleString()} inches
              </Text>
            </View>
          )}

          {data?.itemWidth && (
            <View style={styles.vehicleInfoRow}>
              <Text style={styles.vehicleInfoKey}>Width:</Text>
              <Text style={styles.vehicleInfoValue}>
                {data.itemWidth.toLocaleString()} inches
              </Text>
            </View>
          )}

          {data?.itemLength && (
            <View style={styles.vehicleInfoRow}>
              <Text style={styles.vehicleInfoKey}>Length:</Text>
              <Text style={styles.vehicleInfoValue}>
                {data.itemLength.toLocaleString()} inches
              </Text>
            </View>
          )}

          {data?.itemWeight && (
            <View style={styles.vehicleInfoRow}>
              <Text style={styles.vehicleInfoKey}>Weight:</Text>
              <Text style={styles.vehicleInfoValue}>
                {data.itemWeight.toLocaleString()} lbs
              </Text>
            </View>
          )}

          {data?.vin && (
            <View style={styles.vehicleInfoRow}>
              <Text style={styles.vehicleInfoKey}>VIN:</Text>
              <Text style={styles.vehicleInfoValue}>{data.vin}</Text>
            </View>
          )}
        </View>

        <View style={styles.descriptionContainer}>
          <Text style={styles.sectionTitle}>Vehicle Description</Text>
          <Text style={styles.descriptionText}>{data?.listingDescription || 'N/A'}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.pricingContainer}>
          <Text style={styles.sectionTitle}>Pricing Details</Text>
          <View style={styles.pricingRow}><Text>Base Price:</Text><Text>${sellingPrice.toLocaleString()}</Text></View>
          <View style={styles.pricingRow}><Text>Tax (7%):</Text><Text>${taxAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text></View>
          <View style={styles.totalRow}><Text>Total:</Text><Text>${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</Text></View>
        </View>

        <View style={styles.signatureContainer}>
          <View style={styles.signatureSection}><Text style={styles.sectionTitle}>Seller Signature</Text><Text style={styles.signatureLine}>Date: _________________</Text></View>
          <View style={styles.signatureSection}><Text style={styles.sectionTitle}>Buyer Signature</Text><Text style={styles.signatureLine}>Date: _________________</Text></View>
        </View>

        <View style={styles.termsContainer}>
          <Text style={styles.termsTitle}>Terms & Conditions:</Text>
          <Text style={styles.termsText}>
            1. This invoice represents an offer to sell the described vehicle and is valid for 30 days from the date of issue.
            {'\n'}2. All sales are final. Vehicle is sold as-is with no warranties expressed or implied unless otherwise stated.
            {'\n'}3. Payment must be received in full before vehicle release.
            {'\n'}4. Buyer is responsible for all applicable taxes, registration fees, and transfer costs.
            {'\n'}5. Seller has confirmed the vehicle operates with no issues through service department inspection.
          </Text>
        </View>

        <Text style={styles.footer}>www.withgarage.com | Generated on {today}</Text>
      </Page>
    </Document>
  );
}
