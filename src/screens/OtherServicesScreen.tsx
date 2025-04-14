import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Card, Title, Paragraph, Button, IconButton} from 'react-native-paper';
import {useTheme} from '../theme/ThemeContext';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

const OtherServicesScreen = () => {
  const {colors, isDark} = useTheme();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: colors.background}]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={[styles.headerTitle, {color: colors.text}]}>
            Additional Services
          </Text>
          <Text style={[styles.headerSubtitle, {color: colors.textSecondary}]}>
            Access carriers, phone codes, and financial institutions information worldwide
          </Text>
        </View>

        <View style={styles.cardsContainer}>
          <Card
            style={[styles.card, {backgroundColor: colors.card}]}
            onPress={() => navigation.navigate('CarriersScreen' as never)}>
            <View
              style={[
                styles.cardBanner,
                {backgroundColor: isDark ? '#1A3A5A' : '#E1F5FE'},
              ]}>
              <IconButton
                icon="cellphone-wireless"
                size={60}
                iconColor={isDark ? '#64B5F6' : '#0277BD'}
                style={styles.bannerIcon}
              />
            </View>
            <Card.Content style={styles.cardContent}>
              <Title style={[styles.cardTitle, {color: colors.text}]}>
                Mobile Carriers
              </Title>
              <Paragraph
                style={[styles.cardDescription, {color: colors.textSecondary}]}>
                Browse carriers by region and country to find USSD codes for
                various services
              </Paragraph>

              <View style={styles.features}>
                <View style={styles.featureItem}>
                  <IconButton
                    icon="cellphone"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={[styles.featureText, {color: colors.text}]}>
                    Global carriers database
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <IconButton
                    icon="dialpad"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={[styles.featureText, {color: colors.text}]}>
                    USSD codes by carrier
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <IconButton
                    icon="play-circle-outline"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={[styles.featureText, {color: colors.text}]}>
                    Execute codes directly
                  </Text>
                </View>
              </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('CarriersScreen' as never)}
                style={{backgroundColor: colors.primary}}>
                Browse Carriers
              </Button>
            </Card.Actions>
          </Card>
          <Card
            style={[styles.card, {backgroundColor: colors.card}]}
            onPress={() => navigation.navigate('PhoneCodesScreen' as never)}>
            <View
              style={[
                styles.cardBanner,
                {backgroundColor: isDark ? '#3A1B3A' : '#F3E5F5'},
              ]}>
              <IconButton
                icon="phone-classic"
                size={60}
                iconColor={isDark ? '#BA68C8' : '#7B1FA2'}
                style={styles.bannerIcon}
              />
            </View>
            <Card.Content style={styles.cardContent}>
              <Title style={[styles.cardTitle, {color: colors.text}]}>
                Country Phone Codes
              </Title>
              <Paragraph
                style={[styles.cardDescription, {color: colors.textSecondary}]}>
                Access international dialing codes for countries around the
                world
              </Paragraph>

              <View style={styles.features}>
                <View style={styles.featureItem}>
                  <IconButton
                    icon="earth"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={[styles.featureText, {color: colors.text}]}>
                    Organized by region
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <IconButton
                    icon="magnify"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={[styles.featureText, {color: colors.text}]}>
                    Search by country or code
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <IconButton
                    icon="content-copy"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={[styles.featureText, {color: colors.text}]}>
                    Copy codes with one tap
                  </Text>
                </View>
              </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('PhoneCodesScreen' as never)}
                style={{backgroundColor: colors.primary}}>
                Browse Phone Codes
              </Button>
            </Card.Actions>
          </Card>
          <Card
            style={[styles.card, {backgroundColor: colors.card}]}
            onPress={() => navigation.navigate('BanksScreen' as never)}>
            <View
              style={[
                styles.cardBanner,
                {backgroundColor: isDark ? '#1B3A34' : '#E0F2F1'},
              ]}>
              <IconButton
                icon="bank"
                size={60}
                iconColor={isDark ? '#4DB6AC' : '#00796B'}
                style={styles.bannerIcon}
              />
            </View>
            <Card.Content style={styles.cardContent}>
              <Title style={[styles.cardTitle, {color: colors.text}]}>
                Financial Institutions
              </Title>
              <Paragraph
                style={[styles.cardDescription, {color: colors.textSecondary}]}>
                Access contact information for banks and financial institutions
                worldwide
              </Paragraph>

              <View style={styles.features}>
                <View style={styles.featureItem}>
                  <IconButton
                    icon="bank"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={[styles.featureText, {color: colors.text}]}>
                    Central and commercial banks
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <IconButton
                    icon="phone"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={[styles.featureText, {color: colors.text}]}>
                    Direct contact numbers
                  </Text>
                </View>

                <View style={styles.featureItem}>
                  <IconButton
                    icon="web"
                    size={20}
                    iconColor={colors.primary}
                    style={styles.featureIcon}
                  />
                  <Text style={[styles.featureText, {color: colors.text}]}>
                    Official websites
                  </Text>
                </View>
              </View>
            </Card.Content>

            <Card.Actions style={styles.cardActions}>
              <Button
                mode="contained"
                onPress={() => navigation.navigate('BanksScreen' as never)}
                style={{backgroundColor: colors.primary}}>
                Browse Financial Institutions
              </Button>
            </Card.Actions>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    padding: 16,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
  },
  cardsContainer: {
    padding: 16,
  },
  card: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  cardBanner: {
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bannerIcon: {
    margin: 0,
  },
  cardContent: {
    paddingVertical: 16,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  cardDescription: {
    fontSize: 14,
    marginTop: 4,
    marginBottom: 16,
  },
  features: {
    marginTop: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureIcon: {
    margin: 0,
    marginRight: 8,
  },
  featureText: {
    fontSize: 14,
  },
  cardActions: {
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
});

export default OtherServicesScreen;
