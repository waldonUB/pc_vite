<script>
export default {
  name: 'Redirect',
  created() {
    const { params, query } = this.$route;
    let { path = '' } = params;

    path && path[0] === '/' && (path = path.slice(1));

    this.$router.push({ path: `/${path}`, query });
  },
  render(h) {
    return h();
  },
};
</script>
